import {useNavigation} from '@react-navigation/native';
import {Icon, TopNavigationAction} from '@ui-kitten/components';
import React from 'react';

const BackButton = () => {
  const navigation = useNavigation();

  const MenuIcon = (props) => {
    return <Icon {...props} name="arrow-back" />;
  };
  const openDrawer = () => {
    navigation.goBack();
  };

  return <TopNavigationAction icon={MenuIcon} onPress={openDrawer} />;
};

export default BackButton;
