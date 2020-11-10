import {Card, List, Text, useTheme} from '@ui-kitten/components';
import emptyItemComponent from 'components/emptyItem/emptyItem.component';
import {getCountry} from 'helpers/Countries';
import React from 'react';
import {RefreshControl, View} from 'react-native';
import SendingsListStyles from './sendingsList.styles';

const SendingsList = ({data = [], isLoading, onRefresh, onPressItem}) => {
  const ItemHeader = (props, item) => {
    const {id, country_id} = item;
    const country = getCountry(country_id);
    return (
      <View {...props}>
        <Text category="h6">{`Göndəriş ${id}`}</Text>
        <Text category="s1">{country?.title}</Text>
      </View>
    );
  };

  const ItemFooter = (props, item) => {
    const {weight = ''} = item;
    const theme = useTheme();
    return (
      <View
        {...props}
        style={[
          props.style,
          {backgroundColor: theme['color-info-default']},
          SendingsListStyles.itemFooterContainer,
        ]}>
        <Text category="h6" status="control">{`${weight} kq`}</Text>
      </View>
    );
  };

  const renderItem = ({item}) => {
    const {count, id, sending_id} = item;
    return (
      <Card
        header={(props) => ItemHeader(props, item)}
        footer={(props) => ItemFooter(props, item)}
        status="info"
        style={SendingsListStyles.itemContainer}
        onPress={() => onPressItem?.(sending_id)}>
        <Text>
          Çuval sayı: <Text category="s1">{count}</Text>
        </Text>
      </Card>
    );
  };

  return (
    <List
      style={SendingsListStyles.list}
      ListEmptyComponent={emptyItemComponent}
      data={data}
      renderItem={renderItem}
      contentContainerStyle={[
        SendingsListStyles.listContentContainer,
        data.length ? undefined : {justifyContent: 'center'},
      ]}
      refreshControl={
        <RefreshControl
          tintColor="#009BD8"
          refreshing={isLoading}
          onRefresh={onRefresh}
        />
      }
      keyExtractor={(item) => String(item.id)}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default SendingsList;
