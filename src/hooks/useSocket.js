import {disconnectSocket, initiateSocket} from 'helpers/Socket';
import {useEffect, useState} from 'react';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    function handleConnectionChange(data) {
      setIsConnected(data);
    }

    initiateSocket((socket) => {
      socket.on('connect', () => handleConnectionChange(true));

      socket.on('disconnect', () => handleConnectionChange(false));

      socket.on('connect_failed', () => handleConnectionChange(false));

      socket.on('error', () => handleConnectionChange(false));
    });

    return () => {
      disconnectSocket();
      setIsConnected(false);
    };
  }, []);

  return {isConnected};
}
