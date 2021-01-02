import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import React from 'react';
import {Animated, View} from 'react-native';
import LottieView from 'lottie-react-native';
import ConnectionStyles from './connection.styles';
import {Text} from '@ui-kitten/components';
import {useSocket} from 'hooks/useSocket';

const Connection = ({children}) => {
  const netInfo = useNetInfo();

  const {isConnected} = useSocket();

  const firstUpdate = React.useRef(true);

  React.useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
  }, []);

  if (firstUpdate.current) {
    return children;
  }

  return (
    <View style={ConnectionStyles.container}>
      {children}
      {/* <Animated.View
        style={[
          ConnectionStyles.socketContainer,
          {backgroundColor: isConnected ? '#5DEAA4' : '#E03E26'},
        ]}>
        <Text status="control">
          Siz hal-hazırda {isConnected ? 'online' : 'offline'}-sınız.
        </Text>
      </Animated.View> */}
      {!netInfo.isConnected && (
        <View style={ConnectionStyles.innerContainer}>
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
      )}
    </View>
  );
};

export default Connection;
