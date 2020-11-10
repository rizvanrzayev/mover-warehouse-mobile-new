import React, {useCallback, useMemo, useState} from 'react';
import {
  TopNavigation,
  Icon,
  List,
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
import {fetchSingleQueue, fetchQueueList} from 'actions/queue';
import {giveOrderAction, tookOrderAction, giveOrder} from 'actions/order';
import AwesomeAlert from 'react-native-awesome-alerts';
import {ApiClient, API_ROUTES} from 'config/Api';
import {showMessage} from 'react-native-flash-message';
import {useIsFocused} from '@react-navigation/native';
import BackButton from 'components/backButton/backButton.component';
import {getQueueActionType} from 'helpers/queue';

const QueueDetailScreen = ({
  navigation,
  route,
  fetchSingleQueue,
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
  const {id, customer_name, customer_id, novbe_id, type, from_type} = item;

  // alert(JSON.stringify(item));

  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        fetchSingleQueue(id);
      }, 300);
    }
  }, [isFocused, fetchSingleQueue, id]);

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
    setCanGive(!hasError);
  }, [prepared, preparedParcel, queue]);

  const [canGive, setCanGive] = React.useState(false);
  const [showGiveAlert, setShowGiveAlert] = React.useState(false);
  const [postingCustomerGone, setPostingCustomerGone] = React.useState(false);

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
    Alert.alert('Diqqət!', 'Tapılmadı etmək istədiyinizdən əminsiniz?', [
      {text: 'Xeyr'},
      {
        text: 'Bəli',
        onPress: () => {
          tookOrderAction(
            orderId,
            1,
            id,
            (canGive) => {
              setCanGive(canGive);
              fetchSingleQueue(id);
            },
            (message) => {
              Alert.alert('Diqqət!', message);
            },
          );
        },
      },
    ]);
  };

  const renderRight = (item) => {
    const {sectionName, weight, id: orderId, prepared, pivot} = item;
    const {took_at, not_found} = pivot;
    return (
      <View style={QueueDetailScreenStyles.itemRightContainer}>
        <Text category="p2" style={QueueDetailScreenStyles.itemRightWeight}>
          {prepared
            ? `${item?.orders?.length} bağ.`
            : `${Number(weight).toFixed(2)} kq`}
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
    const {shop, parcel, date5, pivot, id: orderId} = item;
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
      />
    );
  };

  const CompleteIcon = (props) => <Icon name="checkmark" {...props} />;
  const CameraIcon = (props) => <Icon name="camera" {...props} />;

  const onCanGive = (newCanGive) => {
    setCanGive(newCanGive);
  };

  const onPressQRScan = async () => {
    navigation.navigate('QRScanOrder', {onCanGive, queueId: id});
  };

  const onPressGiveOrder = () => {
    setShowGiveAlert(true);
  };

  const onPressCustomerGone = async () => {
    setPostingCustomerGone(true);
    try {
      const response = await ApiClient.post(
        `worker/${API_ROUTES.customerGone}/${id}`,
      );
      fetchQueueList();
      navigation.pop();
    } catch (e) {
    } finally {
      setPostingCustomerGone(false);
      setShowGiveAlert(false);
    }
  };

  const onSuccessScan = (data) => {
    setTimeout(() => {
      setShowGiveAlert(true);
      giveOrderAction(
        data,
        id,
        (message) => {
          showMessage({
            message: 'Uğurlu əməliyyat',
            type: 'success',
          });
          setTimeout(() => {
            fetchQueueList();
          }, 300);
          setShowGiveAlert(false);
          navigation.pop();
        },
        (message) => {
          setShowGiveAlert(false);
          showMessage({
            message,
            type: 'danger',
          });
        },
      );
    }, 500);
  };

  const queueActionType = getQueueActionType(type, from_type);

  const onPressTookOrder = () => {
    requestAnimationFrame(() => {
      setShowGiveAlert(false);
      setTimeout(() => {
        navigation.navigate('QRScan', {onSuccessScan});
      }, 400);
    });
  };

  const alertLoading = isLoadingOrder || postingCustomerGone;

  const tookOrderTitle = queueActionType.tookTitle;

  const renderCustomAlertContent = useCallback(
    <View style={QueueDetailScreenStyles.alertContainer}>
      <Text style={QueueDetailScreenStyles.alertTitle}>Seçim edin</Text>
      {alertLoading && (
        <View style={{alignSelf: 'center', marginBottom: 20}}>
          <Spinner animating size="medium" />
        </View>
      )}
      {type === 0 && from_type === 0 && (
        <Button
          disabled={alertLoading}
          onPress={onPressCustomerGone}
          style={QueueDetailScreenStyles.alertConfirmButton}>
          Müştəri gedib
        </Button>
      )}
      <Button
        status="success"
        disabled={alertLoading}
        onPress={onPressTookOrder}>
        {tookOrderTitle}
      </Button>
    </View>,
    [alertLoading],
  );

  return (
    <SafeAreaView style={QueueDetailScreenStyles.container}>
      <TopNavigation
        title={`${tookOrderTitle} - ${novbe_id}`}
        alignment="center"
        accessoryLeft={BackButton}
      />
      <Divider />
      <Text category="h5" style={{alignSelf: 'center', marginVertical: 10}}>
        {`${customer_name} - ${customer_id || 'ID'}`}
      </Text>
      <List
        data={(!prepared ? queue?.orders : preparedParcel) || []}
        renderItem={({item}) => renderItem({item, prepared})}
        style={QueueDetailScreenStyles.list}
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
      {useMemo(
        () => (
          <AwesomeAlert
            show={showGiveAlert}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            customView={renderCustomAlertContent}
          />
        ),
        [showGiveAlert, renderCustomAlertContent],
      )}
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
  giveOrderAction,
  tookOrderAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueueDetailScreen);
