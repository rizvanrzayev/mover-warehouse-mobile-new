import {
  FETCH_USER,
  FETCH_USER_FAIL,
  FETCH_USER_SUCCESS,
  PUT_USER,
  PUT_USER_FAIL,
  PUT_USER_SUCCESS,
  SIGN_IN,
  SIGN_IN_FAIL,
  SIGN_IN_SUCCESS,
} from 'actions/user';

const initialState = {
  user: {},
  isLoading: false,
  isEditing: false,
  hasError: false,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case PUT_USER:
      return {
        ...state,
        isEditing: true,
        hasError: false,
      };
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
    case PUT_USER_SUCCESS: {
      const {user} = action?.payload?.data;
      return {
        ...state,
        user,
        isEditing: false,
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
    case PUT_USER_FAIL:
      return {
        ...state,
        isEditing: false,
        hasError: true,
      };
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
