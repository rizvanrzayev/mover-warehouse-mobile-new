import {StackActions} from '@react-navigation/native';
import {Divider, Text, TopNavigation} from '@ui-kitten/components';
import {acceptOrderAction} from 'actions/acceptOrder';
import BackButton from 'components/backButton/backButton.component';
import Scanner from 'components/scanner/scanner.component';
import {ApiClient, API_ROUTES} from 'config/Api';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {connect} from 'react-redux';
import AcceptOrderScreenStyles from './acceptOrder.styles';

const AcceptOrderScreen = ({
  route,
  acceptOrderAction,
  isLoading,
  navigation,
}) => {
  const item = route?.params?.item;

  const {type, from_type} = item;

  const isUser =
    (type === 1 && from_type === 0) || (type === 0 && from_type === 3); // Mushteri

  const onScan = async (data) => {
    acceptOrderAction(
      data,
      (message) => {
        if (isUser) {
          navigation.dispatch(StackActions.replace('QueueDetail', {item}));
        } else {
          navigation.dispatch(
            StackActions.replace('ShelfPreparedOrders', {item}),
          );
        }
        showMessage({
          message: JSON.stringify(message),
          type: 'success',
        });
      },
      (message) => {
        showMessage({
          message: JSON.stringify(message),
          type: 'danger',
        });
      },
    );
  };

  const TopContent = () => (
    <Text category="h6">Paketçinin ekranındakı QR-ı oxudun</Text>
  );

  return (
    <SafeAreaView style={AcceptOrderScreenStyles.container}>
      <TopNavigation
        title={
          isLoading
            ? 'Bağlamaların paketçidən qəbulu'
            : 'Zəhmət olmasa gözləyin'
        }
        alignment="center"
        accessoryLeft={BackButton}
      />
      <Divider />
      <Scanner onScan={onScan} topContent={<TopContent />} />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.acceptOrder.isLoading,
  hasError: state.acceptOrder.hasError,
});

const mapDispatchToProps = {
  acceptOrderAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AcceptOrderScreen);
