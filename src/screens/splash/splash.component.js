import React from 'react';
import {View} from 'react-native';
import {Spinner} from '@ui-kitten/components';
import SplashScreenStyles from './splash.styles';

const SplashScreen = () => {
  return (
    <View style={SplashScreenStyles.container}>
      {/* <Spinner animating /> */}
    </View>
  );
};

export default SplashScreen;
