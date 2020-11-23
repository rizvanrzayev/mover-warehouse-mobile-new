/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the UI Kitten template
 * https://github.com/akveo/react-native-ui-kitten
 *
 * Documentation: https://akveo.github.io/react-native-ui-kitten/docs
 *
 * @format
 */

import React, {useCallback, useLayoutEffect, useMemo} from 'react';
import codePush from 'react-native-code-push';

import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {default as theme} from 'theme/custom-theme.json';

import 'react-native-gesture-handler';
import AppNavigator from 'navigation/navigation.component';
import {createStore, applyMiddleware} from 'redux';

import rootReducer from 'reducers';
import thunk from 'redux-thunk';
import axiosMiddleware from 'redux-axios-middleware';
import {ApiClient, configureResponseInterceptors} from 'config/Api';
import {Provider as StoreProvider} from 'react-redux';
import AuthContext from 'contexts/AuthContext';
import {getToken, setToken, removeToken} from 'helpers/AsyncStorage';
import FlashMessage from 'react-native-flash-message';
import {StatusBar, Text, View} from 'react-native';

if (__DEV__) {
  import('config/ReactotronConfig').then(() =>
    console.log('Reactotron Configured'),
  );
}

const logger = (store) => (next) => (action) => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, axiosMiddleware(ApiClient), logger),
);

const initialState = {
  userToken: null,
  isLoading: true,
  isSignout: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_IN':
      return {...state, userToken: action.token, isSignout: false};
    case 'RESTORE_TOKEN':
      return {...state, isLoading: false, userToken: action.token};
    case 'SIGN_OUT':
      return {...state, userToken: null, isSignout: true};
    default:
      return {...state};
  }
};

const App = () => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  const authContext = React.useMemo(
    () => ({
      ...state,
      signIn: async (token) => {
        try {
          await setToken(token);
        } catch (error) {}
        dispatch({type: 'SIGN_IN', token});
      },
      signOut: async () => {
        await removeToken();
        dispatch({type: 'SIGN_OUT'});
      },
    }),
    [state],
  );

  const startApp = async () => {
    let userToken;

    try {
      userToken = await getToken();
    } catch (e) {
      // Restoring token failed
    }
    dispatch({type: 'RESTORE_TOKEN', token: userToken});
  };

  useLayoutEffect(() => {
    startApp();
  }, []);

  useLayoutEffect(() => {
    configureResponseInterceptors(() => {
      authContext.signOut();
    });
  }, [authContext]);

  return (
    <StoreProvider store={store}>
      <View style={{flex: 1}}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
          <AuthContext.Provider value={authContext}>
            <AppNavigator />
          </AuthContext.Provider>
        </ApplicationProvider>
      </View>
      <FlashMessage position="top" />
    </StoreProvider>
  );
};

export default codePush({checkFrequency: codePush.CheckFrequency.MANUAL})(App);
