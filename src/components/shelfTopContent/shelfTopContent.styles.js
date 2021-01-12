import {StyleSheet} from 'react-native';

const ShelfTopContentStyles = StyleSheet.create({
  alertTitle: {
    color: 'white',
  },
  alertMessage: {
    fontSize: 25,
    color: 'white',
  },
  loading: {
    color: 'white',
  },
  topContentTitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  section: {
    color: 'white',
  },
  info: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  sectionData: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  topContentContent: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#42AAFF',
    width: '100%',
  },
  topContentContainer: {
    width: '90%',
  },
  topContentSectionContainer: {
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
});

export default ShelfTopContentStyles;
