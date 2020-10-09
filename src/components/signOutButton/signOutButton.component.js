import {useNavigation} from '@react-navigation/native';
import {Icon, TopNavigationAction} from '@ui-kitten/components';
import {useAuth} from 'contexts/AuthContext';
import React from 'react';
import {Alert} from 'react-native';

const SignOutButton = () => {
  const {signOut} = useAuth();

  const ExitIcon = (props) => {
    return <Icon name="log-out-outline" {...props} />;
  };

  const onPressExit = () => {
    Alert.alert('Diqqət', 'Çıxış etmək istədiyinizdən əminsiniz?', [
      {text: 'XEYR'},
      {text: 'BƏLİ', onPress: signOut, style: 'destructive'},
    ]);
  };

  return <TopNavigationAction icon={ExitIcon} onPress={onPressExit} />;
};

export default SignOutButton;
