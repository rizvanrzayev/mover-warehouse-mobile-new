import {Button, Divider, TopNavigation} from '@ui-kitten/components';
import {addOrderToSackAction, postSackJoinAction} from 'actions/sendings';
import BackButton from 'components/backButton/backButton.component';
import SackInfoView from 'components/sackInfoView/sackInfoView.component';
import Scanner from 'components/scanner/scanner.component';
import React from 'react';
import {Alert, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import SendingsSackSortingScreenStyles from './sendingsSackSorting.styles';

const SendingsSackSortingScreen = ({
  route,
  postSackJoinAction,
  addOrderToSackAction,
  oldSack,
  newSack,
  isLoading,
  isAdding,
}) => {
  const sendingId = route?.params?.id;

  const onScan = (data) => {
    if (data.includes('-346')) {
      if (oldSack && newSack) {
        const requestData = {
          old_sack_id: oldSack.id,
          sack_id: newSack.id,
          order_id: data,
          sending_id: sendingId,
        };
        addOrderToSackAction(requestData);
        return;
      } else {
        Alert.alert('Diqqət!', 'Zəhmət olmasa ilk öncə çuvalı oxudun');
      }
      return;
    }
    const requestData = {
      qr_data: data,
      sending_id: sendingId,
    };
    postSackJoinAction(requestData);
  };

  return (
    <SafeAreaView style={SendingsSackSortingScreenStyles.container}>
      <TopNavigation
        title="Göndəriş"
        alignment="center"
        accessoryLeft={BackButton}
      />
      <Divider />
      <Scanner
        topContent={
          <SackInfoView
            oldSack={oldSack}
            newSack={newSack}
            isLoading={isLoading}
            isAdding={isAdding}
          />
        }
        onScan={onScan}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  oldSack: state.sack.oldSack,
  isAdding: state.sack.isAdding,
  newSack: state.sack.newSack,
  isLoading: state.sack.isLoading,
});

const mapDispatchToProps = {
  postSackJoinAction,
  addOrderToSackAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SendingsSackSortingScreen);
