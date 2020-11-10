import {StyleSheet} from 'react-native';

const ScannerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infraredScannerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  infraredScannerTitle: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowRadius: 10,
    textShadowOffset: {width: 1, height: 1},
  },
  barcodeLottieContainer: {
    width: 150,
    height: 150,
  },
  cameraHelperLottieContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 20,
  },
  bottomContentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  camera: {
    flex: 1,
  },
  cameraBottomView: {
    backgroundColor: 'white',
    flex: 1.5,
  },
  cameraTopView: {
    backgroundColor: 'white',
    zIndex: 99,
    flex: 3.5,
  },
  infraredScannerTopContent: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  infraredScannerBottomContent: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default ScannerStyles;
