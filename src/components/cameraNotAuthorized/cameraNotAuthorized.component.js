import {Button, Text} from '@ui-kitten/components';
import React from 'react';
import {View} from 'react-native';
import CameraNotAuthorizedStyles from './cameraNotAuthorized.styles';

const CameraNotAuthorized = ({onRefreshAuth}) => {
  return (
    <View style={CameraNotAuthorizedStyles.container}>
      <Text category="h6" status="info">
        Kameraya icazə verilməyib
      </Text>
      <Button
        style={CameraNotAuthorizedStyles.refreshAuth}
        onPress={onRefreshAuth}>
        İcazəni yenilə
      </Button>
    </View>
  );
};

export default CameraNotAuthorized;
