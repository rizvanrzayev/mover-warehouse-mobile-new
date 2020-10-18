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
  topContentSectionContainer: {
    alignItems: 'center',
    // marginBottom: 20,
  },
});

export default ShelfTopContentStyles;
