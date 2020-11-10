import {
  ADD_ORDER_TO_SACK,
  ADD_ORDER_TO_SACK_FAIL,
  ADD_ORDER_TO_SACK_SUCCESS,
  POST_SACK_JOIN,
  POST_SACK_JOIN_FAIL,
  POST_SACK_JOIN_SUCCESS,
  RESET_STACKS,
} from 'actions/sendings';

const initialState = {
  oldSack: null,
  newSack: null,
  isLoading: false,
  hasError: false,
  isAdding: false,
};

const sack = (state = initialState, action) => {
  switch (action.type) {
    case RESET_STACKS:
      return {
        ...state,
        oldSack: null,
        newSack: null,
      };
    case POST_SACK_JOIN:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case POST_SACK_JOIN_SUCCESS: {
      const {sack: sackData} = action?.payload?.data;
      return {
        ...state,
        [sackData.is_old ? 'oldSack' : 'newSack']: sackData,
        isLoading: false,
        hasError: false,
      };
    }
    case POST_SACK_JOIN_FAIL: {
      return {
        ...state,
        isLoading: false,
        hasError: true,
      };
    }
    // ADD_ORDER_TO_SACK
    case ADD_ORDER_TO_SACK:
      return {
        ...state,
        isAdding: true,
      };
    case ADD_ORDER_TO_SACK_SUCCESS: {
      return {
        ...state,
        isAdding: false,
      };
    }
    case ADD_ORDER_TO_SACK_FAIL: {
      return {
        ...state,
        isAdding: false,
      };
    }
    default:
      return state;
  }
};

export default sack;
