import {StyleSheet} from 'react-native';

const QRScanScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notAuthText: {
    textAlign: 'center',
  },
  authButton: {
    marginTop: 20,
  },
  camera: {
    flex: 1,
  },
  topContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTitle: {},
  alertMessage: {
    fontSize: 25,
  },
});

export default QRScanScreenStyles;
