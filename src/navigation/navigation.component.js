import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from 'screens/home/home.component';
import SignInScreen from 'screens/singIn/signIn.component';
import QRScanScreen from 'screens/qrScan/qrScan.component';
import QueueDetailScreen from 'screens/queueDetail/queueDetail.component';
import {useAuth} from 'contexts/AuthContext';
import SplashScreen from 'screens/splash/splash.component';
import SettingsScreen from 'screens/settings/settings.component';
import QRScanOrderScreen from 'screens/qrScan/qrScanOrder.component';
import UpdateScreen from 'screens/update/update.component';
import WarehouseScreen from 'screens/warehouse/warehouse.component';
import ShelfPreparedOrdersScreen from 'screens/shelfPreparedOrders/shelfPreparedOrders.components';
import ShelfOrdersScreen from 'screens/shelfOrders/shelfOrders.component';
import AcceptOrderScreen from 'screens/acceptOrder/acceptOrder.component';
import UserDetailScreen from 'screens/userDetail/userDetail.component';
import DrawerContent from 'components/drawerContent/drawerContent.component';
import Config from 'react-native-config';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import Connection from 'components/connection/connection.component';
import EditUserDetailsScreen from 'screens/editUserDetails/editUserDetails.component';
import SendingsScreen from 'screens/sendings/sendings.component';
import SendingsSackSortingScreen from 'screens/sendingsSackSorting/sendingsSackSorting.component';
import WarehouseSendingsScreen from 'screens/warehouseSendings/warehouseSendings.component';
import WarehouseSendingsDetailsScreen from 'screens/warehouseSendingsDetails/warehouseSendingsDetails.component';
import OpenWarehouseSackScreen from 'screens/openWarehouseSack/openWarehouseSack.component';

const {
  Navigator: DrawerNavigator,
  Screen: DrawerScreen,
} = createDrawerNavigator();
const {Navigator, Screen} = createStackNavigator();

const HomeStack = () => (
  <Navigator headerMode="none" screenOptions={{animationEnabled: false}}>
    <Screen name="Home" component={HomeScreen} />
    <Screen name="QueueDetail" component={QueueDetailScreen} />
    <Screen name="QRScan" component={QRScanScreen} />
    <Screen name="QRScanOrder" component={QRScanOrderScreen} />
    <Screen name="ShelfPreparedOrders" component={ShelfPreparedOrdersScreen} />
    <Screen name="ShelfOrders" component={ShelfOrdersScreen} />
    <Screen name="AcceptOrder" component={AcceptOrderScreen} />
  </Navigator>
);

// CODE_PUSH UPDATE COMPONENT DEPLOYMENT KEY
const deploymentKey =
  Platform.OS === 'ios'
    ? Config.CODE_PUSH_KEY_IOS
    : Config.CODE_PUSH_KEY_ANDROID;

const SettingsStack = () => (
  <Navigator headerMode="none" screenOptions={{animationEnabled: false}}>
    <Screen name="Settings" component={SettingsScreen} />
    <Screen name="Update">
      {(screenProps) => (
        <UpdateScreen {...screenProps} deploymentKey={deploymentKey} />
      )}
    </Screen>
  </Navigator>
);

const WarehouseStack = () => (
  <Navigator headerMode="none" screenOptions={{animationEnabled: false}}>
    <Screen name="Warehouse" component={WarehouseScreen} />
  </Navigator>
);

const UserDetailStack = () => (
  <Navigator headerMode="none" screenOptions={{animationEnabled: false}}>
    <Screen name="UserDetail" component={UserDetailScreen} />
    <Screen name="EditUserDetails" component={EditUserDetailsScreen} />
  </Navigator>
);

const SendingsStack = () => (
  <Navigator headerMode="none" screenOptions={{animationEnabled: false}}>
    <Screen name="Sendings" component={SendingsScreen} />
    <Screen name="SendingsSackSorting" component={SendingsSackSortingScreen} />
  </Navigator>
);

const WarehouseSendingsStack = () => (
  <Navigator headerMode="none" screenOptions={{animationEnabled: false}}>
    <Screen name="WarehouseSendings" component={WarehouseSendingsScreen} />
    <Screen
      name="WarehouseSendingsDetails"
      component={WarehouseSendingsDetailsScreen}
    />
    <Screen name="OpenWarehouseSack" component={OpenWarehouseSackScreen} />
    <Screen name="Warehouse" component={WarehouseScreen} />
  </Navigator>
);

export const drawerRef = React.createRef();

const HomeNavigator = () => {
  return (
    <Connection>
      <DrawerNavigator
        backBehavior="none"
        headerMode="none"
        screenOptions={{animationEnabled: false}}
        drawerContent={(props) => <DrawerContent {...props} />}>
        <DrawerScreen
          name="Home"
          component={HomeStack}
          options={{title: 'Növbələr'}}
        />
        <DrawerScreen
          name="Settings"
          component={SettingsStack}
          options={{title: 'Ayarlar'}}
        />
        <DrawerScreen
          name="Warehouse"
          component={WarehouseStack}
          options={{unmountOnBlur: true, title: 'Bağlamaları rəflə'}}
        />
        <DrawerScreen
          name="UserDetail"
          component={UserDetailStack}
          options={{title: 'İstifadəçi məlumatları'}}
        />
        <DrawerScreen
          name="Sendings"
          component={SendingsStack}
          options={{title: 'Göndərişlər'}}
        />
        <DrawerScreen
          name="WarehouseSendings"
          component={WarehouseSendingsStack}
          options={{title: 'Göndərişi rəflə', unmountOnBlur: true}}
        />
      </DrawerNavigator>
    </Connection>
  );
};

const SingInNavigator = () => (
  <Navigator headerMode="none" screenOptions={{animationEnabled: false}}>
    <Screen name="SignIn" component={SignInScreen} />
  </Navigator>
);

const AppNavigator = ({}) => {
  const {isLoading, userToken, isSignout} = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Navigator headerMode="none" screenOptions={{animationEnabled: false}}>
        {userToken == null ? (
          <Screen
            name="SingIn"
            component={SingInNavigator}
            options={{
              animationTypeForReplace: isSignout ? 'pop' : 'push',
            }}
          />
        ) : (
          <Screen
            name="Home"
            component={HomeNavigator}
            options={{animationEnabled: false}}
          />
        )}
      </Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
