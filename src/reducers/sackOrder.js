import {
  FETCH_SACK_ORDERS,
  FETCH_SACK_ORDERS_FAIL,
  FETCH_SACK_ORDERS_SUCCESS,
} from 'actions/sendings';

const initialState = {
  orders: [],
  isLoading: false,
  hasError: false,
};

const sackOrder = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SACK_ORDERS:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case FETCH_SACK_ORDERS_SUCCESS: {
      const {data} = action?.payload?.data;
      return {
        ...state,
        orders: data,
        isLoading: false,
        hasError: false,
      };
    }
    case FETCH_SACK_ORDERS_FAIL: {
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

export default sackOrder;
