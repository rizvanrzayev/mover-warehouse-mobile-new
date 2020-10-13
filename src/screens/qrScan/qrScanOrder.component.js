import React, {useCallback} from 'react';
import {SafeAreaView, View} from 'react-native';
import QRScanScreenStyles from './qrScan.styles';
import {Text, Spinner, TopNavigation} from '@ui-kitten/components';
import {connect} from 'react-redux';
import {tookOrderAction} from 'actions/order';
import {fetchSingleQueue} from 'actions/queue';
import Sound from 'react-native-sound';
import Scanner from 'components/scanner/scanner.component';
import BackButton from 'components/backButton/backButton.component';
import {showMessage} from 'react-native-flash-message';

const errorSound = new Sound('unknown.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    return;
  }
});

const QRScanOrderScreen = ({
  tookOrderAction,
  isLoading,
  navigation,
  fetchSingleQueue,
  route,
}) => {
  const onCanGive = route.params?.onCanGive;

  const queueId = route.params?.queueId;

  const TopContent = (
    <View>
      {isLoading ? (
        <View style={QRScanScreenStyles.topContentContainer}>
          <Spinner animating />
          <Text style={{marginTop: 10}} category="s1">
            Yoxlanılır...
          </Text>
        </View>
      ) : (
        <Text category="h6">Kameranı bağlamaya yaxınlaşdırın</Text>
      )}
    </View>
  );

  const onSuccess = (data) => {
    let orderId = data.split('{')[0].split('-')[0];
    if (data.includes('505')) {
      orderId = orderId + '-505';
    }
    takeOrder(orderId);
  };

  const takeOrder = (orderId) => {
    tookOrderAction(
      orderId,
      0,
      queueId,
      (can_give) => {
        // alert(JSON.stringify(can_give));
        showMessage({
          message: 'Uğurlu əməliyyat',
          type: 'success',
        });
        if (can_give) {
          navigation.pop();
          onCanGive?.(can_give);
        }
      },
      (message) => {
        errorSound.play();
        showMessage({
          message: JSON.stringify(message),
          type: 'danger',
        });
      },
    );
  };

  return (
    <SafeAreaView style={QRScanScreenStyles.container}>
      <TopNavigation
        accessoryLeft={BackButton}
        title="Bağlama"
        alignment="center"
      />
      <Scanner topContent={TopContent} onScan={onSuccess} />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.order.isLoading,
});

const mapDispatchToProps = {
  tookOrderAction,
  fetchSingleQueue,
};

export default connect(mapStateToProps, mapDispatchToProps)(QRScanOrderScreen);
