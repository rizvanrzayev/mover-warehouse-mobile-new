import {API_ROUTES} from 'config/Api';
import {showMessage} from 'react-native-flash-message';

export const POST_SECTION_DATA = 'POST_SECTION_DATA';
export const POST_SECTION_DATA_FAIL = 'POST_SECTION_DATA_FAIL';
export const POST_SECTION_DATA_SUCCESS = 'POST_SECTION_DATA_SUCCESS';

export const POST_ORDER_DATA = 'POST_ORDER_DATA';
export const POST_ORDER_DATA_FAIL = 'POST_ORDER_DATA_FAIL';
export const POST_ORDER_DATA_SUCCESS = 'POST_ORDER_DATA_SUCCESS';

export const postSectionData = (data) => ({
  type: POST_SECTION_DATA,
  payload: {
    request: {
      method: 'POST',
      url: API_ROUTES.selectShelf,
      data,
    },
  },
});

export const postOrderData = (data) => ({
  type: POST_ORDER_DATA,
  payload: {
    request: {
      method: 'POST',
      url: API_ROUTES.addToShelf,
      data,
    },
  },
});

export const postSectionDataAction = (
  data,
  onSuccess = () => {},
  onError = () => {},
) => (dispatch) =>
  dispatch(postSectionData(data))
    .then(
      (action) => {
        const {status, message, data: sectionData} = action?.payload?.data;
        if (status) {
          onSuccess(sectionData);
        } else {
          showMessage({
            message: message,
            type: 'warning',
          });
        }
      },
      (error) => {
        onError();
        throw error;
      },
    )
    .catch(() => {
      onError();
      dispatch({type: POST_SECTION_DATA_FAIL});
    });

export const postOrderDataAction = (
  data,
  onSuccess = () => {},
  onError = () => {},
) => (dispatch) =>
  dispatch(postOrderData(data))
    .then(
      (action) => {
        const {status, message} = action?.payload?.data;
        if (status) {
          onSuccess(action?.payload?.data);
        } else {
          showMessage({
            message: message,
            type: 'danger',
          });
        }
      },
      (error) => {
        onError();
        throw error;
      },
    )
    .catch(() => {
      onError();
      dispatch({type: POST_ORDER_DATA_FAIL});
    });
