import {
  FETCH_QUEUE_LIST,
  FETCH_QUEUE_LIST_FAIL,
  FETCH_QUEUE_LIST_SUCCESS,
} from 'actions/queue';

const initialState = {
  queues: [],
  isLoading: false,
  hasError: false,
};

const queue = (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_QUEUE': {
      return {
        ...state,
        queues: [...state.queues, {...action.newQueue, isNew: true}],
      };
    }
    case FETCH_QUEUE_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case FETCH_QUEUE_LIST_SUCCESS: {
      const {data} = action?.payload?.data;
      return {
        ...state,
        queues: data,
        isLoading: false,
        hasError: false,
      };
    }
    case FETCH_QUEUE_LIST_FAIL: {
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
