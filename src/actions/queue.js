import {API_ROUTES} from 'config/Api';

export const FETCH_QUEUE_LIST = 'FETCH_QUEUE_LIST';
export const FETCH_QUEUE_LIST_FAIL = 'FETCH_QUEUE_LIST_FAIL';
export const FETCH_QUEUE_LIST_SUCCESS = 'FETCH_QUEUE_LIST_SUCCESS';

export const FETCH_SINGLE_QUEUE = 'FETCH_SINGLE_QUEUE';
export const FETCH_SINGLE_QUEUE_FAIL = 'FETCH_SINGLE_QUEUE_FAIL';
export const FETCH_SINGLE_QUEUE_SUCCESS = 'FETCH_SINGLE_QUEUE_SUCCESS';

export const FETCH_ACTIVE_QUEUE = 'FETCH_ACTIVE_QUEUE';
export const FETCH_ACTIVE_QUEUE_FAIL = 'FETCH_ACTIVE_QUEUE_FAIL';
export const FETCH_ACTIVE_QUEUE_SUCCESS = 'FETCH_ACTIVE_QUEUE_SUCCESS';

export const fetchQueueList = () => ({
  type: FETCH_QUEUE_LIST,
  payload: {
    request: {
      method: 'GET',
      url: API_ROUTES.queueList,
    },
  },
});

export const fetchSingleQueue = (queueId) => {
  return {
    type: FETCH_SINGLE_QUEUE,
    payload: {
      request: {
        method: 'GET',
        url: `${API_ROUTES.queue}/${queueId}`,
      },
    },
  };
};
