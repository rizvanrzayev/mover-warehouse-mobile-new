import {Drawer, DrawerItem, IndexPath} from '@ui-kitten/components';
import React from 'react';

const DrawerContent = (props) => {
  const {navigation, state} = props;

  const onPressItem = (descriptor, {nativeEvent}) => {
    if (Object.keys(nativeEvent).length > 0) {
      navigation.navigate(state.routeNames[descriptor.index.row]);
    }
  };

  return (
    <Drawer
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => {
        navigation.navigate(state.routeNames[index.row]);
      }}>
      <DrawerItem title="Növbələr" onPress={onPressItem} />
      <DrawerItem title="Ayarlar" onPress={onPressItem} />
      <DrawerItem title="Bağlamaları rəflə" onPress={onPressItem} />
      <DrawerItem title="İstifadəçi məlumatları" onPress={onPressItem} />
    </Drawer>
  );
};

export default DrawerContent;
