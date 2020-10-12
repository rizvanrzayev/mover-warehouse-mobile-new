import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../screens/home/home.component';
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
  </Navigator>
);

const SettingsStack = () => (
  <Navigator headerMode="none" screenOptions={{animationEnabled: false}}>
    <Screen name="Settings" component={SettingsScreen} />
    <Screen name="Update" component={UpdateScreen} />
  </Navigator>
);

const WarehouseStack = () => (
  <Navigator headerMode="none" screenOptions={{animationEnabled: false}}>
    <Screen name="Warehouse" component={WarehouseScreen} />
  </Navigator>
);

const HomeNavigator = () => (
  <DrawerNavigator
    backBehavior="none"
    headerMode="none"
    screenOptions={{animationEnabled: false}}>
    <DrawerScreen name="Home" component={HomeStack} />
    <DrawerScreen name="Settings" component={SettingsStack} />
    <DrawerScreen name="Warehouse" component={WarehouseStack} />
  </DrawerNavigator>
);

const SingInNavigator = () => (
  <Navigator headerMode="none" screenOptions={{animationEnabled: false}}>
    <Screen name="SignIn" component={SignInScreen} />
  </Navigator>
);

export const AppNavigator = () => {
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
