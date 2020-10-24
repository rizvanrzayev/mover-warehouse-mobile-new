import React from 'react';
import firebase from 'react-native-firebase';

export const useNotification = (onNotification) => {
  React.useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.notifications().onNotification(onNotification);
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [onNotification]);
};

export const useNotificationOpen = (onNotificationOpen) => {
  React.useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase
      .notifications()
      .onNotificationOpened(onNotificationOpen);
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [onNotificationOpen]);
};
