import Config from 'react-native-config';
import io from 'socket.io-client';
import {getToken} from './AsyncStorage';
let socket;

export const initiateSocket = async (onInitiated) => {
  const userToken = await getToken();
  socket = io(`${Config.SOCKET_URL}:${Config.SOCKET_PORT}`, {
    query: {
      token: Config.SOCKET_TOKEN,
      userToken,
    },
  });
  onInitiated?.(socket);
};
export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if (socket) {
    socket.disconnect();
  }
};
