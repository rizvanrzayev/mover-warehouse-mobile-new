import React from 'react';
import {Layout, Text, Input, Button, Spinner} from '@ui-kitten/components';
import SignInStyles from './singIn.styles';
import {KeyboardAvoidingView, Platform, StatusBar} from 'react-native';
import ButtonWithLoader from 'components/button/button.component';
import {connect} from 'react-redux';
import {postSignInAction} from 'actions/user';
import {useAuth} from 'contexts/AuthContext';
import firebase from 'react-native-firebase';

const SignInScreen = ({postSignInAction, isLoading}) => {
  const {signIn} = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const startApp = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
    } else {
      try {
        await firebase.messaging().requestPermission();
        // User has authorised
      } catch (error) {
        // User has rejected permissions
      }
    }
  };

  React.useLayoutEffect(() => {
    startApp();
  }, []);

  const onPressSignIn = async () => {
    if (email.length === 0 || password.length === 0) {
      return;
    }
    const fcmToken = await firebase.messaging().getToken();
    const data = {email, password, fcm_token: fcmToken};
    postSignInAction(data, (token) => {
      signIn(token);
    });
  };

  return (
    <Layout style={SignInStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAvoidingView
        style={SignInStyles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text category="h3" style={SignInStyles.title}>
          {'Welcome to\n Mover Warehouse'}
        </Text>
        <Layout style={{width: '100%'}}>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email daxil edin"
            keyboardType="email-address"
            disabled={isLoading}
          />
          <Input
            placeholder="Şifrə daxil edin"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            disabled={isLoading}
          />
        </Layout>
        <ButtonWithLoader
          onPress={onPressSignIn}
          title="Sign In"
          loading={isLoading}
        />
      </KeyboardAvoidingView>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.user.isLoading,
});

const mapDispatchToProps = {
  postSignInAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);