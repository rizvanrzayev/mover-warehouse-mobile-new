import React from 'react';
import {SafeAreaView, View} from 'react-native';
import QRScanScreenStyles from './qrScan.styles';
import {Text, Spinner, TopNavigation} from '@ui-kitten/components';
import {connect} from 'react-redux';
import {tookOrderAction} from 'actions/order';
import AwesomeAlert from 'react-native-awesome-alerts';
import {fetchSingleQueue} from 'actions/queue';
import Sound from 'react-native-sound';
import BackButton from 'components/backButton/backButton.component';
import Scanner from 'components/scanner/scanner.component';

const successSound = new Sound('section.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    return;
  }
});

const QRScanScreen = ({isLoading, navigation, route}) => {
  const qrRef = React.useRef(null);
  const [error, setError] = React.useState('');

  const onSuccessScan = route.params?.onSuccessScan;

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
        <Text category="h6">Kameranı çekə yaxınlaşdırın</Text>
      )}
    </View>
  );

  const onScan = (data) => {
    successSound.play();
    onSuccessScan?.(data);
    navigation.pop();
  };

  return (
    <SafeAreaView style={QRScanScreenStyles.container}>
      <TopNavigation
        accessoryLeft={BackButton}
        title="Təhvil ver"
        alignment="center"
      />
      <Scanner onScan={onScan} topContent={TopContent} />
      <AwesomeAlert
        show={error !== ''}
        showProgress={false}
        title="Diqqət!!!"
        titleStyle={QRScanScreenStyles.alertTitle}
        message={error}
        messageStyle={QRScanScreenStyles.alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="Geri qayıt"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          navigation.pop();
          setError('');
        }}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(QRScanScreen);
