import React from 'react';

const initialValue = {
  userToken: null,
  isLoading: true,
  isSignout: false,
  signIn: async (token) => {},
  signOut: async () => {},
};

const AuthContext = React.createContext(initialValue);

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;
