import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from 'screens/home/home.component';
import SignInScreen from 'screens/singIn/signIn.component';
import QRScanScreen from 'screens/qrScan/qrScan.component';
import QueueDetailScreen from 'screens/queueDetail/queueDetail.component';
import { useAuth } from 'contexts/AuthContext';
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
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import Connection from 'components/connection/connection.component';
import EditUserDetailsScreen from 'screens/editUserDetails/editUserDetails.component';
import SendingsScreen from 'screens/sendings/sendings.component';
import SendingsSackSortingScreen from 'screens/sendingsSackSorting/sendingsSackSorting.component';
import WarehouseSendingsScreen from 'screens/warehouseSendings/warehouseSendings.component';
import WarehouseSendingsDetailsScreen from 'screens/warehouseSendingsDetails/warehouseSendingsDetails.component';
import OpenWarehouseSackScreen from 'screens/openWarehouseSack/openWarehouseSack.component';
import { fetchUserAction, getPermissions } from 'actions/user';
import { useSocket } from 'hooks/useSocket';
import NewShelfOrdersScreen from 'screens/newShelfOrders/newShelfOrders.component';
import NewPackagingOrdersScreen from 'screens/newPackagingOrders/newPackagingOrders.component';
import NewPackagingOrdersCreateScreen from 'screens/newPackagingOrdersCreate/newPackagingOrdersCreate.component';
import NewSackingOrdersScreen from 'screens/newSackingOrders/newSackingOrders.component';
import NewSortingScreen from 'screens/newSorting/newSorting.component';

const {
    Navigator: DrawerNavigator,
    Screen: DrawerScreen,
} = createDrawerNavigator();
const { Navigator, Screen } = createStackNavigator();

const HomeStack = () => (
    <Navigator headerMode="none" screenOptions={{ animationEnabled: false }}>
        <Screen name="Home" component={HomeScreen} />
        <Screen name="QueueDetail" component={QueueDetailScreen} />
        <Screen name="QRScan" component={QRScanScreen} />
        <Screen name="QRScanOrder" component={QRScanOrderScreen} />
        <Screen name="ShelfPreparedOrders" component={ShelfPreparedOrdersScreen} />
        <Screen name="ShelfOrders" component={ShelfOrdersScreen} />
        <Screen name="AcceptOrder" component={AcceptOrderScreen} />
    </Navigator>
);

const NewShelfOrdersStack = () => (
    <Navigator headerMode="none" screenOptions={{ animationEnabled: false }}>
        <Screen name="NewShelfOrders" component={NewShelfOrdersScreen} />
    </Navigator>
);

const NewPackagingOrdersStack = () => (
    <Navigator headerMode="none" screenOptions={{ animationEnabled: false }}>
        <Screen name="NewPackagingOrders" component={NewPackagingOrdersScreen} />
        <Screen
            name="NewPackagingOrdersCreate"
            component={NewPackagingOrdersCreateScreen}
        />
    </Navigator>
);

const NewSackingOrdersStack = () => (
    <Navigator headerMode="none" screenOptions={{ animationEnabled: false }}>
        <Screen name="NewSackingOrders" component={NewSackingOrdersScreen} />
    </Navigator>
);

const NewSortingStack = () => (
    <Navigator headerMode="none" screenOptions={{ animationEnabled: false }}>
        <Screen name="NewSorting" component={NewSortingScreen} />
    </Navigator>
);
const UserDetailStack = () => (
    <Navigator headerMode="none" screenOptions={{ animationEnabled: false }}>
        <Screen name="UserDetails" component={UserDetailScreen} />
        <Screen name="EditUserDetails" component={EditUserDetailsScreen} />
    </Navigator>
);

// CODE_PUSH UPDATE COMPONENT DEPLOYMENT KEY
const deploymentKey =
    Platform.OS === 'ios'
        ? Config.CODE_PUSH_KEY_IOS
        : Config.CODE_PUSH_KEY_ANDROID;

const SettingsStack = () => (
    <Navigator headerMode="none" screenOptions={{ animationEnabled: false }}>
        <Screen name="Settings" component={SettingsScreen} />
        <Screen name="Update">
            {(screenProps) => (
                <UpdateScreen {...screenProps} deploymentKey={deploymentKey} />
            )}
        </Screen>
    </Navigator>
);

export const drawerRef = React.createRef();

const HomeNavigator = ({ permissions, user }) => {
    // const hasPermissions = (permission) => permissions.includes(permission);
    // const getRouteByPermission = (permission) => {
    //     if (permission === 'sorter'){
    //         return "NewSorting"
    //     }
    // };
    const { routers } = getPermissions(user.position_id)

    if (Object.keys(user).length === 0) {
        return null;
    }

    return (
        <Connection>
            <DrawerNavigator
                backBehavior="none"
                headerMode="none"
                initialRouteName={routers[0]}
                screenOptions={{ animationEnabled: false }}
                drawerContent={(props) => <DrawerContent {...props} />}>
                <DrawerScreen
                    name="NewShelfOrders"
                    component={NewShelfOrdersStack}
                    options={{ unmountOnBlur: true, title: 'Bağlamaları rəflə' }}
                />
                <DrawerScreen
                    name="NewPackagingOrders"
                    component={NewPackagingOrdersStack}
                    options={{ unmountOnBlur: true, title: 'Bağlamaları paketlə' }}
                />
                <DrawerScreen
                    name="NewSackingOrders"
                    component={NewSackingOrdersStack}
                    options={{ unmountOnBlur: true, title: 'Bağlamaları çuvalla' }}
                />
                <DrawerScreen
                    name="NewSorting"
                    component={NewSortingStack}
                    options={{ title: 'Çeşidlə', unmountOnBlur: true }}
                />
                <DrawerScreen
                    name="Settings"
                    component={SettingsStack}
                    options={{ title: 'Ayarlar', unmountOnBlur: true }}
                />
                <DrawerScreen
                    name="UserDetails"
                    component={UserDetailStack}
                    options={{ title: ' İstifadəçi məlumatları', unmountOnBlur: true }}
                />
            </DrawerNavigator>
        </Connection>
    );
};

const SingInNavigator = () => (
    <Navigator headerMode="none" screenOptions={{ animationEnabled: false }}>
        <Screen name="SignIn" component={SignInScreen} />
    </Navigator>
);

const AppNavigator = ({ permissions, fetchUserAction, isLoadingUser, user }) => {
    const { isLoading, userToken, isSignout } = useAuth();

    React.useEffect(() => {
        if (userToken !== null) {
            fetchUserAction();
        }
    }, [fetchUserAction, userToken]);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            <Navigator headerMode="none" screenOptions={{ animationEnabled: false }}>
                {userToken == null ? (
                    <Screen
                        name="SingIn"
                        component={SingInNavigator}
                        options={{
                            animationTypeForReplace: isSignout ? 'pop' : 'push',
                        }}
                    />
                ) : (
                    <Screen name="Home" options={{ animationEnabled: false }}>
                        {() => <HomeNavigator permissions={permissions} user={user} />}
                    </Screen>
                )}
            </Navigator>
        </NavigationContainer>
    );
};

const mapStateToProps = (state) => ({
    permissions: state.permissions,
    isLoadingUser: state.user.isLoading,
    user: state.user.user,
});

const mapDispatchToProps = {
    fetchUserAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
