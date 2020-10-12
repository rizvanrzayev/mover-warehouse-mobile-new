import {StyleSheet} from 'react-native';

const ShelfPreparedOrdersStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  itemRightContainer: {
    flexDirection: 'row',
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
});

export default ShelfPreparedOrdersStyles;
