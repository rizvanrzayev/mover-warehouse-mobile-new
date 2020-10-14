import {StyleSheet} from 'react-native';

const QueueItemStyles = StyleSheet.create({
  activeItemContainer: {
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  rightContainer: {
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  queueContainer: {
    backgroundColor: '#5DEAA4',
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  queueText: {
    color: 'white',
    fontWeight: '500',
  },
  queueTitle: {
    fontSize: 10,
    fontWeight: '900',
  },
  timerContainer: {
    width: 80,
    alignItems: 'flex-end',
  },
});

export default QueueItemStyles;
