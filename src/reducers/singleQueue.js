import {
  FETCH_SINGLE_QUEUE,
  FETCH_SINGLE_QUEUE_FAIL,
  FETCH_SINGLE_QUEUE_SUCCESS,
} from 'actions/queue';

const initialState = {
  queue: {},
  isLoading: false,
  hasError: false,
};

const queue = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SINGLE_QUEUE:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case FETCH_SINGLE_QUEUE_SUCCESS: {
      // const {data} = action?.payload?.data;
      console.log(action?.payload?.data);
      return {
        ...state,
        // queue: data,
        isLoading: false,
        hasError: false,
      };
    }
    case FETCH_SINGLE_QUEUE_FAIL: {
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

export default queue;
