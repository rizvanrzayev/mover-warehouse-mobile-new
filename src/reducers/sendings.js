import {
  FETCH_SENDINGS_LIST,
  FETCH_SENDINGS_LIST_FAIL,
  FETCH_SENDINGS_LIST_SUCCESS,
  FETCH_WAREHOUSE_SENDINGS_LIST,
  FETCH_WAREHOUSE_SENDINGS_LIST_FAIL,
  FETCH_WAREHOUSE_SENDINGS_LIST_SUCCESS,
} from 'actions/sendings';

const initialState = {
  sendings: [],
  warehouseSendings: [],
  isLoading: false,
  hasError: false,
};

const sendings = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WAREHOUSE_SENDINGS_LIST:
    case FETCH_SENDINGS_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case FETCH_WAREHOUSE_SENDINGS_LIST_SUCCESS: {
      const {data} = action?.payload?.data;
      return {
        ...state,
        warehouseSendings: data,
        isLoading: false,
        hasError: false,
      };
    }
    case FETCH_SENDINGS_LIST_SUCCESS: {
      const {data} = action?.payload?.data;
      return {
        ...state,
        sendings: data,
        isLoading: false,
        hasError: false,
      };
    }
    case FETCH_WAREHOUSE_SENDINGS_LIST_FAIL:
    case FETCH_SENDINGS_LIST_FAIL: {
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

export default sendings;
