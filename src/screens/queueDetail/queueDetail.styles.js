import {StyleSheet, Dimensions} from 'react-native';

const QueueDetailScreenStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  itemRightContainer: {
    flexDirection: 'row',
  },
  itemRightQueueContainer: {
    // width: 40,
    // height: 40,
    padding: 5,
    backgroundColor: '#C9FBD8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 16,
  },
  itemRightWeight: {
    alignSelf: 'center',
    marginRight: 10,
  },
  bottomContainer: {
    padding: 10,
  },
  complete: {
    marginTop: 10,
  },
  alertConfirmButton: {
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 20,
  },
  alertContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  alertActionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default QueueDetailScreenStyles;
