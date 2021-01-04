import {StyleSheet} from 'react-native';

const NewPackagingOrdersCreateScreenStyles = StyleSheet.create({
  content: {
    flex: 1,
  },
  queueInfoContainer: {
    padding: 10,
    backgroundColor: '#42AAFF',
  },
  queueInfo: {
    fontSize: 19,
    fontWeight: 'bold',
    alignSelf: 'center',
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
