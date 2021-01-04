import Sound from 'react-native-sound';

const UNKNOWN = 'unknown.mp3';
const SECTION = 'section.mp3';
const NOTIFICATION = 'notification.mp3';
const CLEARLY = 'clearly.mp3';

const PATH = Sound.MAIN_BUNDLE;

export const playCallback = (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
};

export const errorSound = new Sound(UNKNOWN, PATH, playCallback);

export const successSound = new Sound(SECTION, PATH, playCallback);

export const notificationSound = new Sound(NOTIFICATION, PATH, playCallback);

export const clearlySound = new Sound(CLEARLY, PATH, playCallback);
