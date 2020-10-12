import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Button, Card, Icon, Modal, Text} from '@ui-kitten/components';
import {getCurrentScanner} from 'helpers/AsyncStorage';
import {SCANNERS} from 'helpers/scanner';
import React, {useCallback} from 'react';
import {DeviceEventEmitter, Platform, View} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Sound from 'react-native-sound';
import ScannerStyles from './scanner.styles';
import LottieView from 'lottie-react-native';
import SelectScanner from 'components/selectScanner/selectScanner.component';

const Scanner = ({topContent, onScan}) => {
  const qrRef = React.useRef(null);

  const [currentScanner, setCurrentScanner] = React.useState(null);
  const [showHelper, setShowHelper] = React.useState(false);
  const [flashOn, setFlashOn] = React.useState(false);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      fetchCurrentScanner();
    } else {
      removeInfraredScannerListener();
    }
    return () => {
      removeInfraredScannerListener();
    };
  }, [fetchCurrentScanner, isFocused, onScan, removeInfraredScannerListener]);

  const onScanCamera = (data) => {
    onScan?.(data.data);
    setTimeout(() => {
      qrRef?.current?.reactivate?.();
    }, 1000);
  };

  const onScanInfraredScanner = React.useCallback(({code}) => onScan?.(code), [
    onScan,
  ]);

  const removeInfraredScannerListener = useCallback(() => {
    if (currentScanner !== null && currentScanner?.id === SCANNERS[1].id) {
      if (Platform.OS === 'android') {
        DeviceEventEmitter.removeAllListeners();
      }
    }
  }, [currentScanner]);

  const setupInfraredScanner = React.useCallback(() => {
    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener('Scan', onScanInfraredScanner);
    }
  }, [onScanInfraredScanner]);

  const fetchCurrentScanner = React.useCallback(async () => {
    const newCurrentScanner = await getCurrentScanner();
    if (newCurrentScanner !== null) {
      if (newCurrentScanner.id === SCANNERS[0].id) {
        setShowHelper(true);
      }
      if (newCurrentScanner.id === SCANNERS[1].id) {
        setupInfraredScanner();
      }
      setCurrentScanner(newCurrentScanner);
    }
  }, [setupInfraredScanner]);

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
    />
  );

  const renderInfraredScanner = (
    <View style={ScannerStyles.infraredScannerContent}>
      {topContent}
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
  );

  const renderScanner = () => {
    if (currentScanner === null) {
      return renderNoScanner;
    }
    switch (currentScanner.id) {
      case SCANNERS[0].id:
        return renderCameraScanner;
      case SCANNERS[1].id:
        return renderInfraredScanner;
      default:
        return null;
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
