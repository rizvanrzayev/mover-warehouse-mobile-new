import {StyleSheet} from 'react-native';

const SackInfoViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 10,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
  },
  singleSackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addingLoaderContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addingLoaderLottieContainer: {
    width: 120,
    height: 80,
  },
  singleStackContentLoading: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
});

export default SackInfoViewStyles;
