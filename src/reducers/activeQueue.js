import {
  FETCH_SINGLE_QUEUE,
  FETCH_SINGLE_QUEUE_FAIL,
  FETCH_SINGLE_QUEUE_SUCCESS,
} from 'actions/queue';

const initialState = {
  queue: {},
  prepared: false,
  preparedParcel: [],
  isLoading: false,
  hasError: false,
};

const activeQueue = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SINGLE_QUEUE:
      return {
        ...state,
        queue: {},
        preparedParcel: [],
        prepared: false,
        isLoading: true,
        hasError: false,
      };
    case FETCH_SINGLE_QUEUE_SUCCESS: {
      const {queue, prepared, preparedParcel} = action?.payload?.data;
      // console.log(action?.payload?.data);
      return {
        ...state,
        queue,
        preparedParcel,
        prepared,
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

export default activeQueue;
