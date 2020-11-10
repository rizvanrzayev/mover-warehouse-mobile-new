import {CheckBox, ListItem, Text} from '@ui-kitten/components';
import React from 'react';
import {View} from 'react-native';
import OrderListItemStyles from './orderListItem.style';

const OrderListItem = ({order, prepared, onPress, checked}) => {
  const {
    shop,
    parcel,
    date5,
    pivot,
    id: orderId,
    status,
    prepare_orders_unique_id,
    weight,
  } = order;

  let title = !prepared ? shop : 'Toplanmış bağlamalar';
  const {took_at} = pivot;
  const sectionName =
    (!prepared ? parcel?.section_name : order.section_name) || '-------';

  const Left = (props) => {
    return <CheckBox {...props} checked={checked} status="info" />;
  };

  const Right = () => {
    return (
      <View style={OrderListItemStyles.itemRightContainer}>
        <Text category="p2" style={OrderListItemStyles.itemRightWeight}>
          {prepared ? `${order?.orders?.length} .bağ` : `${weight} kq`}
        </Text>
        <View style={OrderListItemStyles.itemRightQueueContainer}>
          <Text category="h6">{sectionName}</Text>
        </View>
      </View>
    );
  };

  return (
    <ListItem
      disabled={took_at}
      title={title}
      description={orderId}
      accessoryLeft={Left}
      accessoryRight={Right}
      onPress={() => onPress(order)}
    />
  );
};

export default OrderListItem;
