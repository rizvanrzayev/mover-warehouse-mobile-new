import React from 'react';
import {Layout, Text, Input} from '@ui-kitten/components';
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

  const emailInputRef = React.useRef();
  const passwordInputRef = React.useRef();

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

  const focusPasswordInput = () => {
    passwordInputRef.current.focus();
  };

  const onPressSignIn = async () => {
    if (email.length === 0 || password.length === 0) {
      return;
    }
    const fcmToken = await firebase.messaging().getToken();
    const data = {email, password, fcm_token: fcmToken};

    requestAnimationFrame(() => {
      postSignInAction(data, (token) => {
        signIn(token);
      });
    });
  };

  return (
    <Layout style={SignInStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAvoidingView
        style={SignInStyles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text category="h3" style={SignInStyles.title}>
          {'Welcome to\n Mover Sorting'}
        </Text>
        <Layout style={{width: '100%'}}>
          <Input
            ref={emailInputRef}
            value={email}
            onChangeText={setEmail}
            placeholder="Email daxil edin"
            keyboardType="email-address"
            disabled={isLoading}
            autoCapitalize="none"
            onSubmitEditing={focusPasswordInput}
          />
          <Input
            ref={passwordInputRef}
            placeholder="Şifrə daxil edin"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            disabled={isLoading}
            onSubmitEditing={onPressSignIn}
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
