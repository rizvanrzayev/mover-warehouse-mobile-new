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

  return (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={openDrawer}
      hitSlop={{bottom: 20, left: 20, right: 20, top: 20}}
    />
  );
};

export default MenuButton;
