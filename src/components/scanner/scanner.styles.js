import {StyleSheet} from 'react-native';

const ScannerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infraredScannerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
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
  cameraBottomView: {
    backgroundColor: 'white',
  },
  cameraTopView: {
    backgroundColor: 'white',
    zIndex: 99,
  },
});

export default ScannerStyles;
