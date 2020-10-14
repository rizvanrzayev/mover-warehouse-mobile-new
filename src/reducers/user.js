import {
  FETCH_USER,
  FETCH_USER_FAIL,
  FETCH_USER_SUCCESS,
  SIGN_IN,
  SIGN_IN_FAIL,
  SIGN_IN_SUCCESS,
} from 'actions/user';

const initialState = {
  user: {},
  isLoading: false,
  hasError: false,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
    case SIGN_IN:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case FETCH_USER_SUCCESS: {
      const {user} = action?.payload?.data;
      return {
        ...state,
        user,
        isLoading: false,
        hasError: false,
      };
    }
    case SIGN_IN_SUCCESS: {
      const {user} = action?.payload?.data;
      return {
        ...state,
        user,
        isLoading: false,
        hasError: false,
      };
    }
    case FETCH_USER_FAIL:
    case SIGN_IN_FAIL:
      return {
        ...state,
        isLoading: false,
        hasError: true,
      };
    default:
      return state;
  }
};

export default user;
