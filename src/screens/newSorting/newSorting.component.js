import {
  Button,
  Card,
  Divider,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import {fetchSendingsList} from 'actions/sendings';
import MenuButton from 'components/menuButton/menuButton.component';
import Scanner from 'components/scanner/scanner.component';
import SendingsList from 'components/sendingsList/sendingsList.component';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import {ApiClient, API_ROUTES} from 'config/Api';
import {isOrder} from 'helpers/Common';
import {clearlySound, errorSound, successSound} from 'helpers/Sounds';
import React from 'react';
import {useLayoutEffect} from 'react';
import {Alert, SafeAreaView, View} from 'react-native';
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
  const [box, setBox] = React.useState(null);
  const [isLoadingSortData, setIsLoadingSortData] = React.useState(false);
  const [canComplete, setCanComplete] = React.useState(true);

  useLayoutEffect(() => {
    fetchSendingsList();
  }, [fetchSendingsList]);

  const fetchOrderSortData = async (orderBarcode) => {
    setIsLoadingSortData(true);
    try {
      const payload = {
        barcode: orderBarcode,
        box_id: String(box.id),
      };
      const response = await ApiClient.post(
        `${API_ROUTES.eachCustomer}/${selectedSendingId}`,
        payload,
      );
      const {status, message, order, message_data, box: newBox} = response.data;
      if (status) {
        successSound.play();
      } else {
        errorSound.play();
      }
      if (newBox) {
        setBox(newBox);
      }
      if (order) {
        setSortedOrderData({order, messageData: message_data, status, message});
      }
    } catch (e) {
    } finally {
      setIsLoadingSortData(false);
    }
  };

  const getOrderBox = async (barcode) => {
    setIsLoadingSortData(true);
    try {
      const response = await ApiClient.get(`${API_ROUTES.orderBox}/${barcode}`);
      const {status, message, box: newBox, is_open} = response.data;
      if (newBox) {
        setBox(newBox);
      }
      setCanComplete(status);
      showMessage({
        message,
        type: status ? 'success' : 'danger',
      });
    } catch (e) {
    } finally {
      setIsLoadingSortData(false);
    }
  };

  const postOpenBox = async (barcode) => {
    setIsLoadingSortData(true);
    try {
      const response = await ApiClient.post(`${API_ROUTES.openBox}/${barcode}`);
      const {status, message, box: newBox, is_open} = response.data;
      if (newBox) {
        setBox(newBox);
      }
      setCanComplete(status);
      showMessage({
        message,
        type: status ? 'success' : 'danger',
      });
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
        <Text status={statusComponent} category="h5">
          {message}
        </Text>
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
      </View>
    );
  };

  const renderSackInfo = () => {
    if (box === null) {
      return null;
    }

    const {name, is_transfer, orders_count, un_sorted_orders_count} = box;
    return (
      <View style={NewSortingScreenStyles.boxInfo}>
        <Text category="h4">{name}</Text>
        <Text>
          Çuvaldakı bağlamalar: <Text category="h4">{orders_count}</Text>
        </Text>
        <Text>
          Ceşidlənməli bağlamalar:{' '}
          <Text category="h3" status="info">
            {un_sorted_orders_count}
          </Text>
        </Text>
      </View>
    );
  };

  const renderOrderView = () => {
    if (sortedOrderData === null) {
      return (
        <View style={NewSortingScreenStyles.noSortedContainer}>
          <Text category="h3" status="info">
            Bağlama oxudun
          </Text>
        </View>
      );
    }
    return <OrderView />;
  };

  const TopContent = () => {
    if (box === null) {
      return (
        <View style={NewSortingScreenStyles.topContent}>
          <Text category="h3" status="info" style={{textAlign: 'center'}}>
            Çuval və ya çuvaldakı bağlamanı oxudun
          </Text>
        </View>
      );
    }
    return (
      <View style={NewSortingScreenStyles.topContent}>
        <Card style={NewSortingScreenStyles.sackInfoContainer}>
          {renderSackInfo()}
        </Card>
        <Card style={NewSortingScreenStyles.orderInfoContainer}>
          {renderOrderView()}
        </Card>
        <Button
          disabled={!canComplete}
          status="success"
          onPress={onPressComplete}
          style={NewSortingScreenStyles.completeButton}>
          BİTİR
        </Button>
      </View>
    );
  };

  const onScan = (barcode) => {
    if (isLoadingSortData) {
      return;
    }
    const checkIsOrder = isOrder(barcode);

    if (!box && checkIsOrder) {
      getOrderBox(barcode);
      return;
    }

    if (checkIsOrder) {
      fetchOrderSortData(barcode);
    } else {
      if (box && !checkIsOrder) {
        showMessage({
          message: 'Zəhmət olmasa əvvəlcə növbəni bitirin!',
          type: 'danger',
        });
        errorSound.play();
        return;
      }
      postOpenBox(barcode);
    }
  };

  const onPressItem = (id) => {
    setSelectedSendingId(id);
  };

  const postOnComplete = async () => {
    setIsLoadingSortData(true);
    try {
      const response = await ApiClient.post(
        `${API_ROUTES.completeBox}/${box.id}`,
      );
      const {status, message, box: newBox, is_open} = response.data;
      if (status) {
        setBox(null);
        setSortedOrderData(null);
      }
      showMessage({
        message,
        type: status ? 'success' : 'danger',
      });
    } catch (e) {
    } finally {
      setIsLoadingSortData(false);
    }
  };

  const onPressComplete = () => {
    if (box.un_sorted_orders_count > 0) {
      Alert.alert(
        'Diqqət!',
        `${box.un_sorted_orders_count} sayda bağlama çeşiddən keçməyib. Çuvalı yenidən yoxlayaraq cəhd edin`,
        [{text: 'BİTİR', onPress: postOnComplete}, {text: 'LƏĞV ET'}],
      );
    } else {
      postOnComplete();
    }
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
