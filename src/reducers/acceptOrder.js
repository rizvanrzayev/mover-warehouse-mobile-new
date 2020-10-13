import {
  ACCEPT_ORDER,
  ACCEPT_ORDER_FAIL,
  ACCEPT_ORDER_SUCCESS,
} from 'actions/acceptOrder';

const initialState = {
  isLoading: false,
  hasError: false,
};

const acceptOrder = (state = initialState, action) => {
  switch (action.type) {
    case ACCEPT_ORDER:
      return {
        ...state,
        queue: {},
        preparedParcel: [],
        prepared: false,
        isLoading: true,
        hasError: false,
      };
    case ACCEPT_ORDER_SUCCESS: {
      const {} = action?.payload?.data;
      console.log('action?.payload?.data: ', action?.payload?.data);
      return {
        ...state,
        isLoading: false,
        hasError: false,
      };
    }
    case ACCEPT_ORDER_FAIL: {
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

export default acceptOrder;
