import {API_ROUTES} from 'config/Api';
import {showMessage} from 'react-native-flash-message';

export const FETCH_SENDINGS_LIST = 'FETCH_SENDINGS_LIST';
export const FETCH_SENDINGS_LIST_FAIL = 'FETCH_SENDINGS_LIST_FAIL';
export const FETCH_SENDINGS_LIST_SUCCESS = 'FETCH_SENDINGS_LIST_SUCCESS';

export const FETCH_WAREHOUSE_SENDINGS_LIST = 'FETCH_WAREHOUSE_SENDINGS_LIST';
export const FETCH_WAREHOUSE_SENDINGS_LIST_FAIL =
  'FETCH_WAREHOUSE_SENDINGS_LIST_FAIL';
export const FETCH_WAREHOUSE_SENDINGS_LIST_SUCCESS =
  'FETCH_WAREHOUSE_SENDINGS_LIST_SUCCESS';

export const FETCH_SACK_ORDERS = 'FETCH_SACK_ORDERS';
export const FETCH_SACK_ORDERS_FAIL = 'FETCH_SACK_ORDERS_FAIL';
export const FETCH_SACK_ORDERS_SUCCESS = 'FETCH_SACK_ORDERS_SUCCESS';

export const POST_SACK_JOIN = 'POST_SACK_JOIN';
export const POST_SACK_JOIN_FAIL = 'POST_SACK_JOIN_FAIL';
export const POST_SACK_JOIN_SUCCESS = 'POST_SACK_JOIN_SUCCESS';

export const ADD_ORDER_TO_SACK = 'ADD_ORDER_TO_SACK';
export const ADD_ORDER_TO_SACK_FAIL = 'ADD_ORDER_TO_SACK_FAIL';
export const ADD_ORDER_TO_SACK_SUCCESS = 'ADD_ORDER_TO_SACK_SUCCESS';

export const RESET_STACKS = 'RESET_STACKS';

export const fetchSendingsList = () => ({
  type: FETCH_SENDINGS_LIST,
  payload: {
    request: {
      method: 'GET',
      url: API_ROUTES.sendings,
    },
  },
});

export const fetchWarehouseSendingsList = () => ({
  type: FETCH_WAREHOUSE_SENDINGS_LIST,
  payload: {
    request: {
      method: 'GET',
      url: API_ROUTES.warehouseSendings,
    },
  },
});

export const fetchSackOrdersList = (sendingId, sackId) => ({
  type: FETCH_SACK_ORDERS,
  payload: {
    request: {
      method: 'GET',
      url: `${API_ROUTES.warehouseSackOrders}/${sendingId}/${sackId}`,
    },
  },
});

export const postSackJoin = (data) => ({
  type: POST_SACK_JOIN,
  payload: {
    request: {
      method: 'POST',
      url: API_ROUTES.sackJoin,
      data,
    },
  },
});

export const addOrderToSack = (data) => ({
  type: ADD_ORDER_TO_SACK,
  payload: {
    request: {
      method: 'POST',
      url: API_ROUTES.addOrderToSack,
      data,
    },
  },
});

export const addOrderToSackAction = (
  data,
  onSuccess = () => {},
  onError = () => {},
) => (dispatch) =>
  dispatch(addOrderToSack(data))
    .then(
      (action) => {
        const {success, message} = action?.payload?.data;
        if (success === true) {
          onSuccess(message);
        } else {
          onError(message);
        }
        showMessage({message, type: success ? 'success' : 'danger'});
      },
      (error) => {
        onError();
        throw error;
      },
    )
    .catch(() => {
      onError();
      dispatch({type: ADD_ORDER_TO_SACK_FAIL});
    });

export const postSackJoinAction = (
  data,
  onSuccess = () => {},
  onError = () => {},
) => (dispatch) =>
  dispatch(postSackJoin(data))
    .then(
      (action) => {
        const {success, message} = action?.payload?.data;
        if (success === true) {
          onSuccess(message);
        } else {
          onError(message);
        }
      },
      (error) => {
        onError();
        throw error;
      },
    )
    .catch(() => {
      onError();
      dispatch({type: POST_SACK_JOIN_FAIL});
    });
