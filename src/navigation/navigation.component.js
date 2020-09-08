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

const {
  Navigator: DrawerNavigator,
  Screen: DrawerScreen,
} = createDrawerNavigator();
const {Navigator, Screen} = createStackNavigator();

const HomeStack = () => (
  <Navigator headerMode="none">
    <Screen name="Home" component={HomeScreen} />
    <Screen name="QueueDetail" component={QueueDetailScreen} />
    <Screen name="QRScan" component={QRScanScreen} />
    <Screen name="QRScanOrder" component={QRScanOrderScreen} />
  </Navigator>
);

const SettingsStack = () => (
  <Navigator headerMode="none">
    <Screen name="Settings" component={SettingsScreen} />
    <Screen name="Update" component={UpdateScreen} />
  </Navigator>
);

const HomeNavigator = () => (
  <DrawerNavigator headerMode="none">
    <DrawerScreen name="Home" component={HomeStack} />
    <DrawerScreen name="Settings" component={SettingsStack} />
  </DrawerNavigator>
);

const SingInNavigator = () => (
  <Navigator headerMode="none">
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
      <Navigator headerMode="none">
        {userToken == null ? (
          <Screen
            name="SingIn"
            component={SingInNavigator}
            options={{
              animationTypeForReplace: isSignout ? 'pop' : 'push',
            }}
          />
        ) : (
          <Screen name="Home" component={HomeNavigator} />
        )}
      </Navigator>
    </NavigationContainer>
  );
};
