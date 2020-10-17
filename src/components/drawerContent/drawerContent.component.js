import {StackActions, useNavigation} from '@react-navigation/native';
import {Drawer, DrawerItem, IndexPath, Text} from '@ui-kitten/components';
import React from 'react';
import {ScrollView, TouchableOpacity} from 'react-native';
import {drawerRef} from 'navigation/navigation.component';
import DrawerContentStyles from './drawerContent.styles';

const DrawerContent = ({onClose}) => {
  const navigation = useNavigation();

  React.useEffect(() => {
    console.log('rerenderedd');
  }, []);

  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));

  return (
    <Drawer selectedIndex={selectedIndex}>
      <DrawerItem
        title="Növbələr"
        onPress={(_, {nativeEvent}) => {
          if (Object.keys(nativeEvent).length > 0) {
            drawerRef.current.close();
            setSelectedIndex(new IndexPath(0));
            navigation.dispatch(StackActions.replace('Home'));
          }
        }}
      />
      <DrawerItem
        title="Ayarlar"
        onPress={(_, {nativeEvent}) => {
          if (Object.keys(nativeEvent).length > 0) {
            drawerRef.current.close();
            setSelectedIndex(new IndexPath(1));
            navigation.dispatch(StackActions.replace('Settings'));
          }
        }}
      />
      <DrawerItem
        title="Bağlamaları rəflə"
        onPress={(_, {nativeEvent}) => {
          if (Object.keys(nativeEvent).length > 0) {
            drawerRef.current.close();
            setSelectedIndex(new IndexPath(2));
            navigation.dispatch(StackActions.replace('Warehouse'));
          }
        }}
      />
      <DrawerItem
        title="İstifadəçi məlumatları"
        onPress={(_, {nativeEvent}) => {
          if (Object.keys(nativeEvent).length > 0) {
            drawerRef.current.close();
            setSelectedIndex(new IndexPath(3));
            navigation.dispatch(StackActions.replace('UserDetail'));
          }
        }}
      />
    </Drawer>
  );
};

export default DrawerContent;
