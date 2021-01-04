import {StyleSheet} from 'react-native';

const NewShelfOrdersStyles = StyleSheet.create({
  titleSending: {
    margin: 10,
  },
  queueQR: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
  },
  modal: {
    padding: 10,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionDetails: {
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionContainer: {
    backgroundColor: '#42AAFF',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  sectionName: {
    fontWeight: 'bold',
    fontSize: 19,
  },
  info: {
    textAlign: 'center',
    marginBottom: 10,
  },
  orderSectionsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'center',
  },
});

export default NewShelfOrdersStyles;
