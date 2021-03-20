import {Divider, Text, TopNavigation} from '@ui-kitten/components';
import {fetchSendingsList} from 'actions/sendings';
import MenuButton from 'components/menuButton/menuButton.component';
import Scanner from 'components/scanner/scanner.component';
import SendingsList from 'components/sendingsList/sendingsList.component';
import {ApiClient, API_ROUTES} from 'config/Api';
import React from 'react';
import {useCallback} from 'react';
import {useMemo} from 'react';
import {SafeAreaView, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {connect} from 'react-redux';
import {errorSound, successSound} from 'helpers/Sounds';
import NewSackingOrdersScreenStyles from './newSackingOrders.styles';
// import {isOrder, isCourierSack, isParcel} from 'helpers/Common';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import {isOrder, isParcel, isCourierSack} from 'helpers/Common';

const NewSackingOrdersScreen = ({
  fetchSendingsList,
  sendings,
  isLoading,
  navigation,
}) => {
  const [selectedSendingId, setSelectedSendingId] = React.useState(null);

  const [selectedSackId, setSelectedSackId] = React.useState(null);

  React.useLayoutEffect(() => {
    fetchSendingsList();
  }, [fetchSendingsList]);

  const selectedSackText = selectedSackId
    ? `Çuval: ${selectedSackId}`
    : 'Çuval oxudun';

  const TopContent = (
    <View style={NewSackingOrdersScreenStyles.scannerTopContentContainer}>
      <Text status="control" category="h5">
        {selectedSackText}
      </Text>
    </View>
  );

  const onPressItem = (id) => {
    setSelectedSendingId(id);
  };

  const onScan = useCallback(
    async (barcode) => {
      if ((isOrder(barcode) || isParcel(barcode)) && !selectedSackId) {
        showMessage({
          message: 'Zəhmət olmasa əvvəlcə çuvalı oxudun',
          type: 'danger',
        });
        errorSound.play();
        return;
      }

      const payload = {};
      payload.barcode = barcode;

      if (selectedSackId) {
        payload.sack_id = selectedSackId;
      }
      console.log('selectedSackId: ', selectedSackId);
      let response;
      try {
        // COURIER SACKS
        if (!isOrder(barcode) && !isParcel(barcode)) {
          response = await ApiClient.get(`${API_ROUTES.sorterSack}/${barcode}`);
        } else if (isCourierSack(selectedSackId) && selectedSackId) {
          response = await ApiClient.post(
            `${API_ROUTES.sorterSacking}/${selectedSackId.replace('-446', '')}`,
            payload,
          );
        } else {
          payload.sending_id = selectedSendingId;
          response = await ApiClient.post(API_ROUTES.sackAddNew, payload);
        }
      } catch (e) {}

      const {status, success, sack, message} = response.data;
      if ((status || success) && sack?.id) {
        setSelectedSackId(
          isCourierSack(barcode) ? `${sack?.id}-446` : `${sack?.id}`,
        );
      }
      showMessage({
        message,
        type: status || success ? 'success' : 'danger',
      });
      status || success ? successSound.play() : errorSound.play();
    },
    [selectedSackId, selectedSendingId],
  );

  const renderContent = useCallback(() => {
    if (selectedSendingId === null) {
      return (
        <View style={NewSackingOrdersScreenStyles.sendingsContainer}>
          <Text
            category="h5"
            status="info"
            style={NewSackingOrdersScreenStyles.titleSending}>
            Göndəriş seçin
          </Text>
          <SendingsList
            data={sendings}
            isLoading={isLoading}
            onRefresh={fetchSendingsList}
            onPressItem={onPressItem}
          />
        </View>
      );
    }
    return <Scanner topContent={TopContent} onScan={onScan} />;
  }, [
    TopContent,
    fetchSendingsList,
    isLoading,
    onScan,
    selectedSendingId,
    sendings,
  ]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TopNavigation
        title="Çuvalla"
        alignment="center"
        accessoryLeft={MenuButton}
        accessoryRight={SignOutButton}
      />
      <Divider />
      {useMemo(() => renderContent(), [renderContent])}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  sendings: state.sendings.sendings,
  isLoading: state.sendings.isLoading,
});

const mapDispatchToProps = {
  fetchSendingsList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewSackingOrdersScreen);
