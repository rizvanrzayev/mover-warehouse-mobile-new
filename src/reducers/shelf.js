import {
  POST_SECTION_DATA,
  POST_SECTION_DATA_FAIL,
  POST_SECTION_DATA_SUCCESS,
  POST_ORDER_DATA,
  POST_ORDER_DATA_FAIL,
  POST_ORDER_DATA_SUCCESS,
} from 'actions/shelf';

const initialState = {
  isLoading: false,
  hasError: false,
};

const shelf = (state = initialState, action) => {
  switch (action.type) {
    case POST_ORDER_DATA:
    case POST_SECTION_DATA:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case POST_ORDER_DATA_SUCCESS:
    case POST_SECTION_DATA_SUCCESS: {
      const {} = action?.payload?.data;
      return {
        ...state,
        isLoading: false,
        hasError: false,
      };
    }
    case POST_ORDER_DATA_FAIL:
    case POST_SECTION_DATA_FAIL: {
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

export default shelf;
