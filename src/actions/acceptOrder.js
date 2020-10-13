import {API_ROUTES} from 'config/Api';

export const ACCEPT_ORDER = 'ACCEPT_ORDER';
export const ACCEPT_ORDER_FAIL = 'ACCEPT_ORDER_FAIL';
export const ACCEPT_ORDER_SUCCESS = 'ACCEPT_ORDER_SUCCESS';

export const acceptOrder = (uniqueId) => ({
  type: ACCEPT_ORDER,
  payload: {
    request: {
      method: 'POST',
      url: API_ROUTES.approveReceivePacket,
      data: {
        unique_id: uniqueId,
      },
    },
  },
});

export const acceptOrderAction = (
  uniqueId,
  onSuccess = () => {},
  onError = () => {},
) => (dispatch) =>
  dispatch(acceptOrder(uniqueId))
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
      dispatch({type: ACCEPT_ORDER_FAIL});
    });
