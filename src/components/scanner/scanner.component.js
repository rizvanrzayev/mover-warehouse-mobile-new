// /* eslint-disable react-hooks/exhaustive-deps */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Button, Card, Icon, Modal, Text} from '@ui-kitten/components';
import {getCurrentScanner} from 'helpers/AsyncStorage';
import {SCANNERS} from 'helpers/scanner';
import React, {useCallback} from 'react';
import {Alert, DeviceEventEmitter, Linking, Platform, View} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ScannerStyles from './scanner.styles';
import LottieView from 'lottie-react-native';
import SelectScanner from 'components/selectScanner/selectScanner.component';
import KeepAwake from 'react-native-keep-awake';
import CameraNotAuthorized from 'components/cameraNotAuthorized/cameraNotAuthorized.component';
import {useDeviceEventEmitter} from '../../hooks/useDeviceEventEmitter';

const Scanner = ({topContent, onScan}) => {
  const qrRef = React.useRef(null);

  const [currentScanner, setCurrentScanner] = React.useState(null);
  const [showHelper, setShowHelper] = React.useState(false);
  const [flashOn, setFlashOn] = React.useState(false);

  React.useEffect(() => {
    KeepAwake.activate();

    return () => {
      KeepAwake.deactivate();
    };
  }, []);

  const onScanCamera = (data) => {
    onScan?.(data.data);
    setTimeout(() => {
      qrRef?.current?.reactivate?.();
    }, 2000);
  };

  const onScanInfraredScanner = React.useCallback(
    ({code}) => {
      onScan?.(code);
      console.log(`code ${new Date().toISOString()}: `, code);
    },
    [onScan],
  );

  useDeviceEventEmitter('Scan', onScanInfraredScanner);

  const fetchCurrentScanner = React.useCallback(async () => {
    const newCurrentScanner = await getCurrentScanner();
    if (newCurrentScanner !== null) {
      if (newCurrentScanner.id === SCANNERS[0].id) {
        setShowHelper(true);
      }
      // if (newCurrentScanner.id === SCANNERS[1].id) {
      //   setupInfraredScanner();
      // }
      setCurrentScanner(newCurrentScanner);
    }
  }, []);

  React.useEffect(() => {
    fetchCurrentScanner();
  }, [fetchCurrentScanner]);

  const FlashIcon = (props) => (
    <Icon {...props} name={flashOn ? 'flash-outline' : 'flash-off-outline'} />
  );

  const BottomContent = (
    <View style={ScannerStyles.bottomContentContainer}>
      <Button
        style={ScannerStyles.toolsButton}
        status="danger"
        accessoryLeft={FlashIcon}
        onPress={() => setFlashOn((value) => !value)}
      />
    </View>
  );

  const renderNoScanner = <SelectScanner />;

  const onRefreshAuth = () => {
    try {
      Linking.openSettings();
    } catch (error) {
      Alert.alert('Diqqət!', 'Ayarlar keçid mümkün olmadı');
    }
  };

  const renderCameraScanner = (
    <QRCodeScanner
      ref={qrRef}
      onRead={onScanCamera}
      showMarker
      customMarker={<BarcodeMask />}
      flashMode={flashOn ? (Platform.OS === 'ios' ? 3 : 2) : 0}
      topContent={topContent}
      bottomViewStyle={ScannerStyles.cameraBottomView}
      topViewStyle={ScannerStyles.cameraTopView}
      bottomContent={BottomContent}
      notAuthorizedView={<CameraNotAuthorized onRefreshAuth={onRefreshAuth} />}
      cameraProps={{
        captureAudio: false,
      }}
    />
  );

  const renderInfraredScanner = (
    <View style={ScannerStyles.infraredScannerContent}>
      <View style={ScannerStyles.infraredScannerTopContent}>{topContent}</View>
      <View style={ScannerStyles.infraredScannerBottomContent}>
        <Text category="h4" style={ScannerStyles.infraredScannerTitle}>
          Infrared vasitəsi ilə bağlamanı oxudun
        </Text>
        <View style={ScannerStyles.barcodeLottieContainer}>
          <LottieView
            source={require('assets/lotties/barcode.json')}
            autoPlay
            loop
          />
        </View>
      </View>
    </View>
  );

  const renderScanner = () => {
    if (currentScanner === null) {
      return renderNoScanner;
    } else {
      switch (currentScanner.id) {
        case SCANNERS[0].id:
          return renderCameraScanner;
        case SCANNERS[1].id:
          return renderInfraredScanner;
        default:
          return null;
      }
    }
  };

  const renderHelperView = () => (
    <Modal visible={showHelper}>
      <Card disabled={true}>
        <Text category="s1">Bağlamanı kameraya yaxınlaşdırın</Text>
        <View style={ScannerStyles.cameraHelperLottieContainer}>
          <LottieView
            source={require('assets/lotties/barcode-camera.json')}
            autoPlay
            loop
          />
        </View>
        <Button onPress={() => setShowHelper(false)}>OLDU</Button>
      </Card>
    </Modal>
  );

  return (
    <View style={ScannerStyles.container}>
      {renderScanner()}
      {/* {showHelper && renderHelperView()} */}
    </View>
  );
};

export default Scanner;
