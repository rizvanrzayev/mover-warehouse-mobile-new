import React from 'react';
import {Layout, Icon, Text, withStyles} from '@ui-kitten/components';
import EmptyItemStyles from './emptyItem.styles';
import {View} from 'react-native';

const EmptyItem = (props) => {
  const {eva, style, ...restProps} = props;

  return (
    <Layout style={EmptyItemStyles.container}>
      <Icon name="alert-circle" fill="#EB7B78" style={EmptyItemStyles.icon} />
      <Text style={EmptyItemStyles.text} category="h5">
        Heçbir məlumat yoxdur
      </Text>
      <Text style={EmptyItemStyles.text} category="p1">
        Aşağı çəkərək yeniləyin
      </Text>
    </Layout>
  );
};

export default withStyles(EmptyItem, (theme) => ({
  iconColor: theme['color-primary-500'],
}));
