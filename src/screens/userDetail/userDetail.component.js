import {
  Avatar,
  Button,
  Card,
  Divider,
  Spinner,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import {fetchUser} from 'actions/user';
import MenuButton from 'components/menuButton/menuButton.component';
import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {connect} from 'react-redux';
import UserDetailScreenStyles from './userDetail.styles';
import LottieView from 'lottie-react-native';
import {useIsFocused} from '@react-navigation/native';

const UserDetailScreen = ({fetchUser, isLoading, user}) => {
  const {name, surname, email, image} = user;

  const isFocused = useIsFocused();

  React.useLayoutEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [fetchUser, isFocused]);

  return (
    <SafeAreaView style={UserDetailScreenStyles.container}>
      <TopNavigation
        accessoryLeft={MenuButton}
        title={isLoading ? 'Yenilənir...' : 'İstifadəçi məlumatları'}
        alignment="center"
      />
      <View style={UserDetailScreenStyles.topContainer}>
        <LottieView
          autoPlay
          loop
          source={require('assets/lotties/warehouse.json')}
        />
      </View>
      <View style={UserDetailScreenStyles.bottomContainer}>
        {!image ? (
          <View style={{width: 80, height: 80}}>
            <LottieView
              autoPlay
              loop
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
  fetchUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailScreen);
