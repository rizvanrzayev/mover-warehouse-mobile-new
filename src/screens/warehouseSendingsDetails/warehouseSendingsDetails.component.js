import {useIsFocused} from '@react-navigation/native';
import {
  Button,
  Divider,
  Icon,
  List,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import {fetchSackOrdersList} from 'actions/sendings';
import BackButton from 'components/backButton/backButton.component';
import OrderListItem from 'components/orderListItem/orderListItem.component';
import React from 'react';
import {RefreshControl, SafeAreaView, View} from 'react-native';
import {connect} from 'react-redux';
import WarehouseSendingsDetailsScreenStyles from './warehouseSendingsDetails.style';

const CompleteIcon = (props) => <Icon name="checkmark" {...props} />;

const WarehouseSendingsDetailsScreen = ({
  route,
  fetchSackOrdersList,
  isLoading,
  orders,
  navigation,
}) => {
  const sendingId = route?.params?.sendingId;
  const sack = route?.params?.sack;

  const [canComplete, setCanComplete] = React.useState(false);

  React.useLayoutEffect(() => {
    let newCanComplete = true;
    if (orders.length > 0) {
      orders.forEach((order) => {
        if (!order.is_shelfed) {
          newCanComplete = false;
        }
      });
    } else {
      newCanComplete = false;
    }
    setCanComplete(newCanComplete);
  }, [orders]);

  const isFocused = useIsFocused();

  React.useLayoutEffect(() => {
    if (isFocused) {
      fetchSackOrdersList(sendingId, sack.id);
    }
  }, [fetchSackOrdersList, sack.id, sendingId, isFocused]);

  const onPressShelfOrder = () => {
    navigation.navigate('Warehouse', {back: true});
  };

  const onPressComplete = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={WarehouseSendingsDetailsScreenStyles.container}>
      <TopNavigation
        title={`Göndəriş - ${sendingId}`}
        alignment="center"
        accessoryLeft={BackButton}
      />
      <Divider />
      <List
        data={orders}
        renderItem={({item}) => (
          <OrderListItem order={item} checked={item.is_shelfed} />
        )}
        style={WarehouseSendingsDetailsScreenStyles.list}
        refreshControl={
          <RefreshControl
            tintColor="#009BD8"
            refreshing={isLoading}
            onRefresh={() => {}}
          />
        }
      />
      <View style={WarehouseSendingsDetailsScreenStyles.bottomContainer}>
        <Button
          status="info"
          style={WarehouseSendingsDetailsScreenStyles.scan}
          onPress={onPressShelfOrder}>
          Rəflə
        </Button>
        <Button
          disabled={!canComplete}
          accessoryLeft={CompleteIcon}
          status="success"
          style={WarehouseSendingsDetailsScreenStyles.complete}
          onPress={onPressComplete}>
          Tamamla
        </Button>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  orders: state.sackOrder.orders,
  isLoading: state.sackOrder.isLoading,
});

const mapDispatchToProps = {
  fetchSackOrdersList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WarehouseSendingsDetailsScreen);
