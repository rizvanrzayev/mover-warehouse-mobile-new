import {Card, Divider, Text, TopNavigation} from '@ui-kitten/components';
import {fetchSendingsList} from 'actions/sendings';
import MenuButton from 'components/menuButton/menuButton.component';
import Scanner from 'components/scanner/scanner.component';
import SendingsList from 'components/sendingsList/sendingsList.component';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import {ApiClient, API_ROUTES} from 'config/Api';
import {clearlySound, errorSound, successSound} from 'helpers/Sounds';
import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {connect} from 'react-redux';
import NewSortingScreenStyles from './newSorting.styles';

const NewSortingScreen = ({
  fetchSendingsList,
  sendings,
  isLoading,
  navigation,
}) => {
  const [selectedSendingId, setSelectedSendingId] = React.useState(null);
  const [sortedOrderData, setSortedOrderData] = React.useState(null);
  const [isLoadingSortData, setIsLoadingSortData] = React.useState(false);

  const fetchOrderSortData = async (orderBarcode) => {
    setIsLoadingSortData(true);
    try {
      const payload = {
        barcode: orderBarcode,
      };
      const response = await ApiClient.post(
        `${API_ROUTES.eachCustomer}/${selectedSendingId}`,
        payload,
      );
      const {status, message, order, message_data} = response.data;
      if (status) {
        successSound.play(() => successSound.release());
      } else {
        errorSound.play(() => errorSound.release());
      }
      setSortedOrderData({order, messageData: message_data, status, message});
    } catch (e) {
    } finally {
      setIsLoadingSortData(false);
    }
  };

  const OrderView = () => {
    const {messageData, order, status, message} = sortedOrderData;
    const {
      orders_count,
      office_name,
      users_name,
      surname,
      code,
      shop,
      weight,
    } = messageData;
    const statusComponent = status ? 'info' : 'danger';
    return (
      <View style={NewSortingScreenStyles.orderViewContent}>
        <Card
          status={statusComponent}
          style={NewSortingScreenStyles.orderViewContainer}>
          <Text status={statusComponent} category="h5">
            {message}
          </Text>
        </Card>
        <Card
          status={statusComponent}
          style={NewSortingScreenStyles.orderViewContainer}>
          <Text category="s1">
            Bağlama sayı: <Text category="h3">{orders_count}</Text>
          </Text>
          <Text category="s1">
            Məntəqə: <Text category="h3">{office_name}</Text>
          </Text>
          <Text category="s1">
            Müştəri:{' '}
            <Text category="h3">
              {users_name} {surname}
            </Text>
          </Text>
          <Text category="s1">
            Mağaza: <Text category="h3">{shop}</Text>
          </Text>
        </Card>
      </View>
    );
  };

  const TopContent = () => (
    <View style={NewSortingScreenStyles.topContent}>
      {sortedOrderData === null ? (
        <Text category="h3" status="info">
          Bağlama oxudun
        </Text>
      ) : (
        <OrderView />
      )}
    </View>
  );

  const onScan = (barcode) => {
    if (isLoadingSortData) {
      return;
    }
    fetchOrderSortData(barcode);
  };

  const onPressItem = (id) => {
    setSelectedSendingId(id);
  };

  const renderContent = () => {
    if (selectedSendingId === null) {
      return (
        <View style={NewSortingScreenStyles.sendingsContainer}>
          <Text
            category="h5"
            status="info"
            style={NewSortingScreenStyles.titleSending}>
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
    if (isLoadingSortData) {
      return (
        <View style={NewSortingScreenStyles.loadingContainer}>
          <Text category="h4">Zəhmət olmasa gözləyin...</Text>
        </View>
      );
    }
    return (
      <View style={NewSortingScreenStyles.contentContainer}>
        <TopContent />
        <View style={NewSortingScreenStyles.cameraContainer}>
          <Scanner onScan={onScan} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={NewSortingScreenStyles.container}>
      <TopNavigation
        title="Bağlamaları çeşidlə"
        alignment="center"
        accessoryLeft={MenuButton}
        accessoryRight={SignOutButton}
      />
      <Divider />
      <View style={NewSortingScreenStyles.contentContainer}>
        {renderContent()}
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewSortingScreen);
