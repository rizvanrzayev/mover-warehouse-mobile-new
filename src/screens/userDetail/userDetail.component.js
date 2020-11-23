import {
  Avatar,
  Icon,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {fetchUserAction} from 'actions/user';
import MenuButton from 'components/menuButton/menuButton.component';
import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {connect} from 'react-redux';
import UserDetailScreenStyles from './userDetail.styles';
import LottieView from 'lottie-react-native';
import {useIsFocused} from '@react-navigation/native';

const UserDetailScreen = ({fetchUserAction, isLoading, user, navigation}) => {
  const {name, surname, email, image} = user;

  const isFocused = useIsFocused();

  React.useLayoutEffect(() => {
    if (isFocused) {
      fetchUserAction();
    }
  }, [fetchUserAction, isFocused]);

  const onPressEditUser = () => {
    navigation.navigate('EditUserDetails');
  };

  const SettingsIcon = (props) => <Icon {...props} name="settings-2-outline" />;

  const SettingsAction = () => (
    <TopNavigationAction icon={SettingsIcon} onPress={onPressEditUser} />
  );

  return (
    <SafeAreaView style={UserDetailScreenStyles.container}>
      <TopNavigation
        accessoryLeft={MenuButton}
        accessoryRight={SettingsAction}
        title={isLoading ? 'Yenilənir...' : 'İstifadəçi məlumatları'}
        alignment="center"
      />
      <View style={UserDetailScreenStyles.topContainer}>
        <LottieView
          autoPlay
          loop={false}
          source={require('assets/lotties/warehouse.json')}
        />
      </View>
      <View style={UserDetailScreenStyles.bottomContainer}>
        {!image ? (
          <View style={{width: 80, height: 80}}>
            <LottieView
              autoPlay
              loop={false}
              source={require('assets/lotties/profile.json')}
            />
          </View>
        ) : (
          <Avatar
            source={{
              uri: image,
            }}
          />
        )}
        <Text category="h6" style={{marginTop: 20}}>
          {name}
        </Text>
        <Text category="s1">{!surname ? '------' : surname}</Text>
        <Text category="h5" style={{marginTop: 20}}>
          {email}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  isLoading: state.user.isLoading,
});

const mapDispatchToProps = {
  fetchUserAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailScreen);
