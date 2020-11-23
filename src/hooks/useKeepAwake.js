import React from 'react';
import KeepAwake from 'react-native-keep-awake';

export const useKeepAwake = () => {
  React.useEffect(() => {
    KeepAwake.activate();
    // unsubscribe to the listener when unmounting
    return () => KeepAwake.deactivate();
  }, []);
};
