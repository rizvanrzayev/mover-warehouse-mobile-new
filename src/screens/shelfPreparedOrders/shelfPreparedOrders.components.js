import {
  Button,
  CheckBox,
  Divider,
  Icon,
  List,
  ListItem,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import {fetchQueueList, fetchSingleQueue} from 'actions/queue';
import BackButton from 'components/backButton/backButton.component';
import React from 'react';
import {RefreshControl, SafeAreaView, View} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import ShelfPreparedOrdersStyles from './shelfPreparedOrders.styles';
import {ApiClient} from 'config/Api';
import {showMessage} from 'react-native-flash-message';

const ShelfPreparedOrdersScreen = ({
  navigation,
  route,
  fetchSingleQueue,
  orders,
  queue,
  isLoading,
  isLoadingOrder,
  fetchQueueList,
  prepared,
  preparedParcel,
}) => {
  const {item} = route.params;
  const {id, customer_name, customer_id, novbe_id} = item;

  const [canComplete, setCanComplete] = React.useState(false);

  React.useLayoutEffect(() => {
    let newCanComplete = true;
    if (preparedParcel.length > 0) {
      preparedParcel.forEach((order) => {
        if (order.status === 0) {
          newCanComplete = false;
        }
      });
    } else {
      newCanComplete = false;
    }
    setCanComplete(newCanComplete);
  }, [preparedParcel]);

  React.useLayoutEffect(() => {
    fetchSingleQueue(id);
  }, []);

  const Left = (props, status) => {
    return <CheckBox {...props} checked={status === 1} status="info" />;
  };

  const renderRight = (item) => {
    const {sectionName, weight, id: orderId, pivot} = item;
    const {took_at, not_found} = pivot;
    return (
      <View style={ShelfPreparedOrdersStyles.itemRightContainer}>
        <Text category="p2" style={ShelfPreparedOrdersStyles.itemRightWeight}>
          {`${item?.orders?.length} bağ.`}
        </Text>
        <View style={ShelfPreparedOrdersStyles.itemRightQueueContainer}>
          <Text category="h6">{sectionName}</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({item, prepared}) => {
    const {
      shop,
      parcel,
      date5,
      pivot,
      id: orderId,
      status,
      prepare_orders_unique_id,
    } = item;
    let title = !prepared ? shop : 'Toplanmış bağlamalar';
    const {took_at, not_found} = pivot;
    const sectionName =
      (!prepared ? parcel?.section_name : item.section_name) || '-------';
    return (
      <ListItem
        disabled={took_at}
        title={title}
        description={prepare_orders_unique_id}
        accessoryLeft={(props) => Left(props, status)}
        accessoryRight={(props) =>
          renderRight({...item, prepared, sectionName})
        }
        // onPress={onPressItem}
      />
    );
  };

  const CompleteIcon = (props) => <Icon name="checkmark" {...props} />;
  const CameraIcon = (props) => <Icon name="camera" {...props} />;

  const onSuccessShelf = () => {
    fetchSingleQueue(id);
  };

  const onPressShelfOrder = () => {
    navigation.navigate('ShelfOrders', {onSuccessShelf, item});
  };

  const postCompeleteShelf = async () => {
    const response = await ApiClient.get(`end/${item.id}`);
    return response;
  };

  const onPressComplete = async () => {
    try {
      const response = await postCompeleteShelf();
      const {success} = response.data;
      if (success === true) {
        fetchQueueList();
        navigation.pop();
        showMessage({
          message: 'Uğurlu əməliyyat',
          type: 'success',
        });
      } else {
        showMessage({
          message: 'Səhv baş verdi!',
          type: 'danger',
        });
        // error
      }
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };

  return (
    <SafeAreaView style={ShelfPreparedOrdersStyles.container}>
      <TopNavigation
        title={`Toplanmış bağlamaları rəflə - ${novbe_id}`}
        alignment="center"
        accessoryLeft={BackButton}
      />
      <Divider />
      <Text category="h5" style={{alignSelf: 'center', marginVertical: 10}}>
        {`${customer_name === '' ? '-----' : customer_name}`}
      </Text>
      <Divider />
      <List
        data={(!prepared ? queue?.orders : preparedParcel) || []}
        renderItem={({item}) => renderItem({item, prepared})}
        style={ShelfPreparedOrdersStyles.list}
        refreshControl={
          <RefreshControl
            tintColor="#009BD8"
            refreshing={isLoading}
            onRefresh={() => fetchSingleQueue(id)}
          />
        }
      />
      <View style={ShelfPreparedOrdersStyles.bottomContainer}>
        <Button
          accessoryLeft={CameraIcon}
          status="info"
          style={ShelfPreparedOrdersStyles.scan}
          onPress={onPressShelfOrder}>
          Scan QR
        </Button>
        <Button
          disabled={!canComplete}
          accessoryLeft={CompleteIcon}
          status="success"
          style={ShelfPreparedOrdersStyles.complete}
          onPress={onPressComplete}>
          Tamamla
        </Button>
      </View>
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShelfPreparedOrdersScreen);
