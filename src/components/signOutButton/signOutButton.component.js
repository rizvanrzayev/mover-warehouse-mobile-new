import {Icon, TopNavigationAction} from '@ui-kitten/components';
import {ApiClient} from 'config/Api';
import {useAuth} from 'contexts/AuthContext';
import React from 'react';
import {Alert} from 'react-native';
import {showMessage} from 'react-native-flash-message';

const SignOutButton = () => {
  const {signOut} = useAuth();

  const ExitIcon = (props) => {
    return <Icon name="log-out-outline" {...props} />;
  };

  const onPressSignOut = async () => {
    try {
      const response = await ApiClient.post('worker/status', {status: false});
      if (response.data.status === true) {
        showMessage({
          message: 'Çıxış edildi',
          type: 'success',
        });
        signOut();
      } else {
        showMessage({
          message: 'Çıxış edilə bilmədi',
          type: 'danger',
        });
      }
    } catch (error) {
    } finally {
    }
  };

  const onPressExit = () => {
    Alert.alert('Diqqət', 'Çıxış etmək istədiyinizdən əminsiniz?', [
      {text: 'XEYR'},
      {text: 'BƏLİ', onPress: onPressSignOut, style: 'destructive'},
    ]);
  };

  return <TopNavigationAction icon={ExitIcon} onPress={onPressExit} />;
};

export default SignOutButton;
