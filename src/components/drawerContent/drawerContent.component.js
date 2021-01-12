import {Drawer, DrawerItem, IndexPath} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView} from 'react-native';
import Permissions from 'react-redux-permissions';
import DrawerContentStyles from './drawerContent.styles';

const DrawerContent = (props) => {
  const {navigation, state} = props;

  const onPressItem = (routeName, {nativeEvent}) => {
    if (Object.keys(nativeEvent).length > 0) {
      navigation.navigate(routeName);
    }
  };

  return (
    <SafeAreaView style={DrawerContentStyles.container}>
      <Drawer
        selectedIndex={new IndexPath(state.index)}
        onSelect={(index) => {
          navigation.navigate(state.routeNames[index.row]);
        }}>
        <Permissions fallbackElement={null} allowed={['queue']}>
          <DrawerItem
            selected={state.index === 0}
            title="Rəflə"
            onPress={(_, event) => onPressItem('NewShelfOrders', event)}
          />
        </Permissions>
        <Permissions fallbackElement={null} allowed={['queue']}>
          <DrawerItem
            selected={state.index === 1}
            title="Bağlamaları paketlə"
            onPress={(_, event) => onPressItem('NewPackagingOrders', event)}
          />
        </Permissions>
        <Permissions fallbackElement={null} allowed={['queue']}>
          <DrawerItem
            selected={state.index === 2}
            title="Çuvalla"
            onPress={(_, event) => onPressItem('NewSackingOrders', event)}
          />
        </Permissions>
        <DrawerItem
          title="Ayarlar"
          onPress={(_, event) => onPressItem('Settings', event)}
        />
      </Drawer>
    </SafeAreaView>
  );
};

export default DrawerContent;
