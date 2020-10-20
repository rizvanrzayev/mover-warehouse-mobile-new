import {API_ROUTES} from 'config/Api';
import {showMessage} from 'react-native-flash-message';
import {add, remove} from 'react-redux-permissions/dist/actions';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_IN_FAIL = 'SIGN_IN_FAIL';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_FAIL = 'FETCH_USER_FAIL';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

export const PUT_USER = 'PUT_USER';
export const PUT_USER_FAIL = 'PUT_USER_FAIL';
export const PUT_USER_SUCCESS = 'PUT_USER_SUCCESS';

export const fetchUser = () => ({
  type: FETCH_USER,
  payload: {
    request: {
      method: 'GET',
      url: API_ROUTES.me,
    },
  },
});

export const putUser = (data) => ({
  type: PUT_USER,
  payload: {
    request: {
      method: 'PUT',
      url: API_ROUTES.me,
      data,
    },
  },
});

export const putUserAction = (data, onSuccess, onError) => (dispatch) =>
  dispatch(putUser(data)).then(
    (action) => {
      if (!action?.payload?.data) {
        return;
      }
      const {user, status} = action?.payload?.data;
      if (status) {
        onSuccess();
      } else {
        onError();
      }
      return action;
    },
    (error) => {
      throw error;
    },
  );

export const fetchUserAction = () => (dispatch) =>
  dispatch(fetchUser()).then(
    (action) => {
      if (!action?.payload?.data) {
        return;
      }
      const {user} = action?.payload?.data;
      if (user.position_id === 3) {
        dispatch(add('shelf'));
      } else {
        dispatch(remove('shelf'));
      }
      return action;
    },
    (error) => {
      throw error;
    },
  );

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
