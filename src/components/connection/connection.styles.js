import {StyleSheet} from 'react-native';

const ConnectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noInternetContainer: {
    width: 250,
    height: 250,
  },
  errorText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default ConnectionStyles;
