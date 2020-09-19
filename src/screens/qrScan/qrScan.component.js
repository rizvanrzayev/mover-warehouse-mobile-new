import React, {useEffect} from 'react';
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
import {Text, Button, Spinner} from '@ui-kitten/components';
import BarcodeMask from 'react-native-barcode-mask';
import {connect} from 'react-redux';
import {giveOrder, tookOrder, tookOrderAction} from 'actions/order';
import AwesomeAlert from 'react-native-awesome-alerts';
import {fetchActiveQueue, fetchSingleQueue} from 'actions/queue';
import Sound from 'react-native-sound';
import order from 'reducers/order';

const successSound = new Sound('section.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const errorSound = new Sound('unknown.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const QRScanScreen = ({
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

  const qrRef = React.useRef(null);
  const [error, setError] = React.useState('');
  const [showCamera, setShowCamera] = React.useState(false);

  const onSuccessScan = route.params?.onSuccessScan;

  React.useLayoutEffect(() => {
    setTimeout(() => {
      setShowCamera(true);
    }, 300);
    // DeviceEventEmitter.addListener('Scan', (event) => {
    //   const {code} = event;
    //   let newCode = code.split('{')[0].split('-')[0];
    //   // return;
    //   onSuccessScan?.({data: newCode});
    //   navigation.pop();
    // });
    // return () => {
    //   DeviceEventEmitter.removeAllListeners();
    // };
  }, []);

  useEffect(() => {
    if (qrRef !== null && isLoading === false) {
      // qrRef.current.reactivate();
    }
  }, [isLoading]);

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

  const onSuccess = (data) => {
    successSound.play();
    onSuccessScan?.(data);
    navigation.pop();
  };

  return (
    <SafeAreaView style={QRScanScreenStyles.container}>
      {showCamera && (
        <QRCodeScanner
          ref={qrRef}
          onRead={onSuccess}
          showMarker
          customMarker={<BarcodeMask />}
          // flashMode={RNCamera.Constants.FlashMode.torch}
          topContent={TopContent}
          bottomContent={<Button onPress={() => navigation.pop()}>Geri</Button>}
          bottomViewStyle={{backgroundColor: 'white'}}
          topViewStyle={{backgroundColor: 'white', zIndex: 99}}
        />
      )}
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
