import {useNetInfo} from '@react-native-community/netinfo';
import React from 'react';
import {View} from 'react-native';
import LottieView from 'lottie-react-native';
import ConnectionStyles from './connection.styles';
import {Text} from '@ui-kitten/components';

const Connection = ({children}) => {
  const {isConnected, isInternetReachable, details, type} = useNetInfo();

  const firstUpdate = React.useRef(true);
  React.useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
  });

  if (firstUpdate.current) {
    return children;
  }

  return isConnected ? (
    children
  ) : (
    <View style={ConnectionStyles.container}>
      <View style={ConnectionStyles.noInternetContainer}>
        <LottieView
          autoPlay
          loop
          source={require('assets/lotties/no-connection-internet.json')}
          colorFilters={[
            {
              keypath: 'wave 2 Outlines',
              color: '#E03E26',
            },
            {
              keypath: 'wave Outlines',
              color: '#E03E26',
            },
            {
              keypath: 'wifi Outlines',
              color: '#E03E26',
            },
          ]}
        />
      </View>
      <Text status="danger" style={ConnectionStyles.errorText}>
        İnternet əlaqəsi yoxdur
      </Text>
    </View>
  );
};

export default Connection;
