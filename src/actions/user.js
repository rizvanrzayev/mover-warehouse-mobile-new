import {API_ROUTES} from 'config/Api';
import {showMessage} from 'react-native-flash-message';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_IN_FAIL = 'SIGN_IN_FAIL';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_FAIL = 'FETCH_USER_FAIL';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

export const fetchUser = () => ({
  type: FETCH_USER,
  payload: {
    request: {
      method: 'GET',
      url: API_ROUTES.me,
    },
  },
});

export const postSignIn = (data) => ({
  type: SIGN_IN,
  payload: {
    request: {
      method: 'POST',
      url: API_ROUTES.login,
      data,
    },
  },
});

export const postSignInAction = (data, onSuccess = (token) => {}) => (
  dispatch,
) =>
  dispatch(postSignIn(data)).then(
    (action) => {
      if (!action?.payload?.data) {
        return;
      }
      const {status, message, user} = action?.payload?.data;
      if (status) {
        onSuccess(user.token);
      } else {
        showMessage({
          message,
        });
      }
      return action;
    },
    (error) => {
      throw error;
    },
  );
