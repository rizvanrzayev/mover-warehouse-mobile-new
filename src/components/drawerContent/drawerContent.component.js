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
        <DrawerItem
          title="Növbələr"
          onPress={(_, event) => onPressItem('Home', event)}
        />
        <DrawerItem
          title="Ayarlar"
          onPress={(_, event) => onPressItem('Settings', event)}
        />
        <Permissions fallbackElement={null} allowed={['shelf']}>
          <DrawerItem
            selected={state.index === 2}
            title="Bağlamaları rəflə"
            onPress={(_, event) => onPressItem('Warehouse', event)}
          />
        </Permissions>
        <DrawerItem
          title="İstifadəçi məlumatları"
          onPress={(_, event) => onPressItem('UserDetail', event)}
        />
        <Permissions fallbackElement={null} allowed={['sendings']}>
          <DrawerItem
            title="Göndərişlər"
            onPress={(_, event) => onPressItem('Sendings', event)}
          />
        </Permissions>
        <Permissions fallbackElement={null} allowed={['shelf']}>
          <DrawerItem
            title="Göndərişi rəflə"
            onPress={(_, event) => onPressItem('WarehouseSendings', event)}
          />
        </Permissions>
      </Drawer>
    </SafeAreaView>
  );
};

export default DrawerContent;
