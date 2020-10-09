import {useNavigation} from '@react-navigation/native';
import {Icon, TopNavigationAction} from '@ui-kitten/components';
import React from 'react';

const MenuButton = () => {
  const navigation = useNavigation();

  const MenuIcon = (props) => {
    return <Icon name="menu-2-outline" {...props} />;
  };

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return <TopNavigationAction icon={MenuIcon} onPress={openDrawer} />;
};

export default MenuButton;
