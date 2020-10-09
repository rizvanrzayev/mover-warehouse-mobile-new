import {
  GIVE_ORDER,
  GIVE_ORDER_FAIL,
  GIVE_ORDER_SUCCESS,
  TOOK_ORDER,
  TOOK_ORDER_FAIL,
  TOOK_ORDER_SUCCESS,
} from 'actions/order';

const initialState = {
  queue: {},
  isLoading: false,
  hasError: false,
};

const order = (state = initialState, action) => {
  switch (action.type) {
    case GIVE_ORDER: {
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    }
    case GIVE_ORDER_SUCCESS: {
      // const {queue} = action?.payload?.data;
      return {
        ...state,
        isLoading: false,
        hasError: false,
      };
    }
    case GIVE_ORDER_FAIL: {
      return {
        ...state,
        isLoading: false,
        hasError: true,
      };
    }
    case TOOK_ORDER:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case TOOK_ORDER_SUCCESS: {
      // const {queue} = action?.payload?.data;
      return {
        ...state,
        isLoading: false,
        hasError: false,
      };
    }
    case TOOK_ORDER_FAIL: {
      return {
        ...state,
        isLoading: false,
        hasError: true,
      };
    }
    default:
      return state;
  }
};

export default order;
