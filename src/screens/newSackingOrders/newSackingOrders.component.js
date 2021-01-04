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

  const isOrder = (data) => data.includes('-346');

  const onScan = useCallback(
    async (barcode) => {
      if (isOrder(barcode) && !selectedSackId) {
        showMessage({
          message: 'Zəhmət olmasa əvvəlcə çuvalı oxudun',
          type: 'danger',
        });
        errorSound.play();
        return;
      }

      const payload = {
        sending_id: selectedSendingId,
        barcode,
      };

      if (selectedSackId) {
        payload.sack_id = selectedSackId;
      }

      const response = await ApiClient.post(API_ROUTES.sackAdd, payload);
      const {status, sack_id, message} = response.data;
      if (status && sack_id) {
        setSelectedSackId(sack_id);
      }
      showMessage({
        message,
        type: status ? 'success' : 'danger',
      });
      status ? successSound.play() : errorSound.play();
    },
    [selectedSackId, selectedSendingId],
  );

  const renderContent = useCallback(() => {
    if (selectedSendingId === null) {
      return (
        <View>
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
        title="Bağlamaları çuvalla"
        alignment="center"
        accessoryLeft={MenuButton}
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
