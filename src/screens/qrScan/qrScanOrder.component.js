import React, {useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import QRScanScreenStyles from './qrScan.styles';
import {Text, Button, Spinner, TopNavigation} from '@ui-kitten/components';
import BarcodeMask from 'react-native-barcode-mask';
import {connect} from 'react-redux';
import {giveOrder, tookOrder, tookOrderAction} from 'actions/order';
import AwesomeAlert from 'react-native-awesome-alerts';
import {fetchSingleQueue} from 'actions/queue';
import Sound from 'react-native-sound';
import order from 'reducers/order';
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
  const NotAuthView = (
    <View style={QRScanScreenStyles.notAuthContainer}>
      <Text category="h3" style={QRScanScreenStyles.notAuthText}>
        Kameraya icazə verilməyib
      </Text>
      <Button style={QRScanScreenStyles.authButton}>İcazəni yenilə</Button>
    </View>
  );

  const [error, setError] = React.useState('');

  const qrRef = React.useRef(null);

  const onCanGive = route.params?.onCanGive;

  const queueId = route.params?.queueId;

  // React.useLayoutEffect(() => {
  //   setTimeout(() => {
  //     setShowCamera(true);
  //   }, 300);
  //   DeviceEventEmitter.addListener('Scan', onScanFromDevice);
  //   return () => {
  //     DeviceEventEmitter.removeAllListeners();
  //   };
  // }, [onScanFromDevice]);

  // const onScanFromDevice = useCallback(
  //   (event) => {
  //     const {code} = event;
  //     let orderId = code.split('{')[0].split('-')[0];
  //     if (code.includes('505')) {
  //       orderId = orderId + '-505';
  //     }
  //     takeOrder(orderId);
  //   },
  //   [takeOrder],
  // );

  // useEffect(() => {
  //   if (qrRef !== null && isLoading === false) {
  //     // qrRef.current.reactivate();
  //   }
  // }, [isLoading]);

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
    const splitedData = data.split('-');
    let orderId = splitedData[0];
    const orderToken = splitedData[1];
    if (orderToken === '505') {
      orderId = orderId + '-505';
    }
    takeOrder(orderId);
  };

  const takeOrder = useCallback(
    (orderId) => {
      tookOrderAction(
        orderId,
        0,
        queueId,
        (can_give) => {
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
          setError(`${message}`);
        },
      );
    },
    [navigation, onCanGive, queueId, tookOrderAction],
  );

  return (
    <SafeAreaView style={QRScanScreenStyles.container}>
      <TopNavigation
        accessoryLeft={BackButton}
        title="Bağlama"
        alignment="center"
      />
      <Scanner topContent={TopContent} onScan={onSuccess} />
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

export default connect(mapStateToProps, mapDispatchToProps)(QRScanOrderScreen);
