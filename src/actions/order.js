import {API_ROUTES} from 'config/Api';

export const GIVE_ORDER = 'GIVE_ORDER';
export const GIVE_ORDER_FAIL = 'GIVE_ORDER_FAIL';
export const GIVE_ORDER_SUCCESS = 'GIVE_ORDER_SUCCESS';

export const TOOK_ORDER = 'TOOK_ORDER';
export const TOOK_ORDER_FAIL = 'TOOK_ORDER_FAIL';
export const TOOK_ORDER_SUCCESS = 'TOOK_ORDER_SUCCESS';

export const giveOrder = (orderId) => ({
  type: GIVE_ORDER,
  payload: {
    request: {
      method: 'POST',
      url: `${API_ROUTES.give}/${orderId}`,
    },
  },
});

export const giveOrderAction = (
  orderId,
  onSuccess = () => {},
  onError = () => {},
) => (dispatch) =>
  dispatch(giveOrder(orderId))
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
      dispatch({type: GIVE_ORDER_FAIL});
    });

export const tookOrder = (orderId, notFound, queueId) => ({
  type: TOOK_ORDER,
  payload: {
    request: {
      method: 'POST',
      url: `${API_ROUTES.took}/${orderId}`,
      data: {
        not_found: notFound,
        queue_id: queueId,
      },
    },
  },
});

export const tookOrderAction = (
  orderId,
  notFound,
  queueId,
  onSuccess = () => {},
  onError = () => {},
) => (dispatch) =>
  dispatch(tookOrder(orderId, notFound, queueId)).then(
    (action) => {
      const {success, message, can_give} = action?.payload?.data;
      if (success === true) {
        onSuccess(can_give);
      } else {
        onError(message);
      }
    },
    (error) => {
      throw error;
    },
  );
