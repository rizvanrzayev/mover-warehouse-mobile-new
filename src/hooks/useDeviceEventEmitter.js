import {useEffect, useRef} from 'react';
import {DeviceEventEmitter} from 'react-native';

export function useDeviceEventEmitter(eventName, handler) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = DeviceEventEmitter && DeviceEventEmitter.addListener;
    if (!isSupported) {
      return;
    }

    const eventListener = (event) => savedHandler.current(event);

    DeviceEventEmitter.addListener(eventName, eventListener);

    return () => {
      DeviceEventEmitter.removeListener(eventName, eventListener);
    };
  }, [eventName]);
}
