import {StyleSheet} from 'react-native';

const NewPackagingOrdersCreateScreenStyles = StyleSheet.create({
  content: {
    flex: 1,
  },
  queueInfoContainer: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 10,
    margin: 15,
  },
  itemContainer: {
    marginBottom: 10,
    marginHorizontal: 15,
  },
  itemHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemContainer: {},
  completeContainer: {
    padding: 10,
  },
});

export default NewPackagingOrdersCreateScreenStyles;
