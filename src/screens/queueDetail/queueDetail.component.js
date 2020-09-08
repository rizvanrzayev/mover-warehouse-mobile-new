import React, {useState} from 'react';
import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  List,
  Card,
  Text,
  Button,
  ListItem,
  Divider,
  CheckBox,
  Spinner,
} from '@ui-kitten/components';
import {SafeAreaView, View, RefreshControl, Alert} from 'react-native';
import QueueDetailScreenStyles from './queueDetail.styles';
import {connect} from 'react-redux';
import moment from 'moment';
import {
  fetchSingleQueue,
  fetchActiveQueue,
  fetchQueueList,
} from 'actions/queue';
import {giveOrderAction, tookOrderAction, giveOrder} from 'actions/order';
import AwesomeAlert from 'react-native-awesome-alerts';
import {ApiClient, API_ROUTES} from 'config/Api';
import {showMessage} from 'react-native-flash-message';

const QueueDetailScreen = ({
  navigation,
  route,
  fetchSingleQueue,
  fetchActiveQueue,
  orders,
  queue,
  isLoading,
  isLoadingOrder,
  giveOrderAction,
  tookOrderAction,
  fetchQueueList,
  prepared,
  preparedParcel,
}) => {
  const {item} = route.params;
  const {id, customer_name} = item;
  React.useLayoutEffect(() => {
    fetchSingleQueue(id);
    // fetchActiveQueue();
  }, []);

  React.useEffect(() => {
    let hasError = false;
    let ordersParsed = prepared ? preparedParcel : queue?.orders;
    if (ordersParsed?.length > 0) {
      ordersParsed?.forEach((order) => {
        if (order.pivot.took_at === null) {
          hasError = true;
        }
      });
    } else {
      hasError = true;
    }
    if (!hasError) {
      setCanGive(true);
    }
  }, [queue]);

  const [canGive, setCanGive] = React.useState(false);
  const [showGiveAlert, setShowGiveAlert] = React.useState(false);
  const [postingCustomerGone, setPostingCustomerGone] = React.useState(false);

  const MenuIcon = (props) => {
    return <Icon {...props} name="arrow-back" />;
  };
  const openDrawer = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={openDrawer} />
  );

  const Left = (props, took_at, not_found) => {
    return (
      <CheckBox
        {...props}
        checked={took_at !== null || not_found === 1}
        status="info"
      />
    );
  };

  const onPressNotFound = (orderId) => {
    console.log(orderId);
    tookOrderAction(
      orderId,
      1,
      id,
      (canGive) => {
        setCanGive(canGive);
        fetchSingleQueue(id);
      },
      (message) => {
        alert(message);
      },
    );
  };

  const renderRight = (item) => {
    const {sectionName, weight, id: orderId, prepared, pivot} = item;
    const {took_at, not_found} = pivot;
    return (
      <View style={QueueDetailScreenStyles.itemRightContainer}>
        <Text category="p2" style={QueueDetailScreenStyles.itemRightWeight}>
          {weight} kq
        </Text>
        <View style={QueueDetailScreenStyles.itemRightQueueContainer}>
          <Text category="h6">{sectionName}</Text>
        </View>
        {!prepared && (
          <Button
            disabled={took_at !== null || isLoadingOrder || not_found === 1}
            size="tiny"
            onPress={() => onPressNotFound(orderId)}>
            Tapılmadı
          </Button>
        )}
      </View>
    );
  };

  const renderItem = ({item, prepared}) => {
    const {shop, parcel, date5, pivot, id} = item;
    let title = !prepared ? shop : 'Toplanmış bağlamalar';
    const {took_at, not_found} = pivot;
    const sectionName =
      (!prepared ? parcel?.section_name : item.section_name) || '-------';
    return (
      <ListItem
        disabled={took_at}
        title={title}
        description={
          date5 === '0000-00-00' ? '-' : moment(date5).format('DD MM YYYY')
        }
        accessoryLeft={(props) => Left(props, took_at, not_found)}
        accessoryRight={(props) =>
          renderRight({...item, prepared, sectionName})
        }
        // onPress={onPressItem}
      />
    );
  };

  const CompleteIcon = (props) => <Icon name="checkmark" {...props} />;
  const CameraIcon = (props) => <Icon name="camera" {...props} />;

  const onCanGive = (newCanGive) => {
    setCanGive(newCanGive);
  };

  const onPressQRScan = () => {
    navigation.navigate('QRScanOrder', {onCanGive, queueId: id});
  };

  const onPressGiveOrder = () => {
    setShowGiveAlert(true);
  };

  const onPressCustomerGone = async () => {
    setPostingCustomerGone(true);
    try {
      const response = await ApiClient.post(`${API_ROUTES.customerGone}/${id}`);
      console.log(response.data);
      fetchQueueList();
      navigation.pop();
    } catch (e) {
    } finally {
      setPostingCustomerGone(false);
      setShowGiveAlert(false);
    }
  };

  const onSuccessScan = (data) => {
    setShowGiveAlert(true);
    giveOrderAction(
      data.data,
      (message) => {
        fetchQueueList();
        setShowGiveAlert(false);
        navigation.pop();
      },
      (message) => {
        setShowGiveAlert(false);
        setTimeout(() => {
          Alert.alert('Diqqət!', message);
        }, 300);
      },
    );
  };

  const onPressTookOrder = () => {
    navigation.navigate('QRScan', {onSuccessScan});
    setShowGiveAlert(false);
  };

  const alertLoading = isLoadingOrder || postingCustomerGone;

  const renderCustomAlertContent = (
    <View style={QueueDetailScreenStyles.alertContainer}>
      <Text style={QueueDetailScreenStyles.alertTitle}>Seçim edin</Text>
      {alertLoading && (
        <View style={{alignSelf: 'center', marginBottom: 20}}>
          <Spinner animating size="medium" />
        </View>
      )}
      <Button
        disabled={alertLoading}
        onPress={onPressCustomerGone}
        style={QueueDetailScreenStyles.alertConfirmButton}>
        Müştəri gedib
      </Button>
      <Button
        status="success"
        disabled={alertLoading}
        onPress={onPressTookOrder}>
        Təhvil ver
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={QueueDetailScreenStyles.container}>
      <TopNavigation
        title="Queue Detail"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Text category="h4" style={{alignSelf: 'center', marginVertical: 10}}>{customer_name}</Text>
      <List
        data={(!prepared ? queue?.orders : preparedParcel) || []}
        renderItem={({item}) => renderItem({item, prepared})}
        style={QueueDetailScreen.list}
        refreshControl={
          <RefreshControl
            tintColor="#009BD8"
            refreshing={isLoading}
            onRefresh={() => fetchSingleQueue(id)}
          />
        }
      />
      <View style={QueueDetailScreenStyles.bottomContainer}>
        <Button
          accessoryLeft={CameraIcon}
          status="info"
          style={QueueDetailScreenStyles.scan}
          onPress={onPressQRScan}>
          Scan QR
        </Button>
        <Button
          disabled={!canGive}
          accessoryLeft={CompleteIcon}
          status="success"
          style={QueueDetailScreenStyles.complete}
          onPress={onPressGiveOrder}>
          Tamamla
        </Button>
      </View>
      <AwesomeAlert
        show={showGiveAlert}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        customView={renderCustomAlertContent}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  queue: state.activeQueue.queue,
  preparedParcel: state.activeQueue.preparedParcel,
  prepared: state.activeQueue.prepared,
  isLoading: state.activeQueue.isLoading,
  isLoadingOrder: state.order.isLoading,
});

const mapDispatchToProps = {
  fetchQueueList,
  fetchSingleQueue,
  fetchActiveQueue,
  giveOrderAction,
  tookOrderAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueueDetailScreen);
