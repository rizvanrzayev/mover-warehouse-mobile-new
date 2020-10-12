import {useNavigation} from '@react-navigation/native';
import {Button, Text} from '@ui-kitten/components';
import React from 'react';
import {View} from 'react-native';
import SelectScannerStyles from './selectScanner.styles';

const SelectScanner = () => {
  const navigation = useNavigation();

  const onPressSelectScanner = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={SelectScannerStyles.container}>
      <Text category="h4">Skanner tipi seçilməyib.</Text>
      <Text category="h6">Zəhmət olmasa skanner seçin</Text>
      <Button
        style={SelectScannerStyles.selectScannerButton}
        onPress={onPressSelectScanner}>
        Skanner seç
      </Button>
    </View>
  );
};

export default SelectScanner;
