// /* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Button, Icon, Text} from '@ui-kitten/components';
import {getCurrentScanner} from 'helpers/AsyncStorage';
import {SCANNERS} from 'helpers/scanner';
import {Alert, Linking, Platform, View} from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ScannerStyles from './scanner.styles';
import LottieView from 'lottie-react-native';
import SelectScanner from 'components/selectScanner/selectScanner.component';
import CameraNotAuthorized from 'components/cameraNotAuthorized/cameraNotAuthorized.component';
import {useDeviceEventEmitter} from 'hooks/useDeviceEventEmitter';
import {useIsFocused} from '@react-navigation/native';
import {useKeepAwake} from 'hooks/useKeepAwake';

const Scanner = ({topContent, onScan, showContent = true}) => {
  const qrRef = React.useRef(null);

  const [currentScanner, setCurrentScanner] = React.useState(null);
  const [flashOn, setFlashOn] = React.useState(false);

  const onScanCamera = (data) => {
    onScan?.(data.data);
    setTimeout(() => {
      qrRef?.current?.reactivate?.();
    }, 1000);
  };

  const onScanInfraredScanner = React.useCallback(
    ({code}) => {
      onScan?.(code.split('{')[0]);
    },
    [onScan],
  );

  useDeviceEventEmitter('Scan', onScanInfraredScanner);
  useKeepAwake();

  const fetchCurrentScanner = React.useCallback(async () => {
    const newCurrentScanner = await getCurrentScanner();
    if (newCurrentScanner !== null) {
      setCurrentScanner(newCurrentScanner);
    }
  }, []);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      fetchCurrentScanner();
    }
  }, [fetchCurrentScanner, isFocused]);

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
      cameraStyle={ScannerStyles.camera}
      notAuthorizedView={<CameraNotAuthorized onRefreshAuth={onRefreshAuth} />}
      cameraProps={{
        captureAudio: false,
      }}
    />
  );

  const renderInfraredScanner = (
    <View style={ScannerStyles.infraredScannerContent}>
      {topContent && (
        <View style={ScannerStyles.infraredScannerTopContent}>
          {topContent}
        </View>
      )}
      <View style={ScannerStyles.infraredScannerBottomContent}>
        <Text category="h4" style={ScannerStyles.infraredScannerTitle}>
          Infrared vasitəsi ilə bağlamanı oxudun
        </Text>
        <View style={ScannerStyles.barcodeLottieContainer}>
          <LottieView
            source={require('assets/lotties/barcode.json')}
            autoPlay
            loop={false}
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

  if (!showContent) {
    return null;
  }
  return <View style={ScannerStyles.container}>{renderScanner()}</View>;
};

export default Scanner;
