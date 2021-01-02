import {API_ROUTES} from 'config/Api';

export const FETCH_PREPARE_DATA = 'FETCH_PREPARE_DATA';
export const FETCH_PREPARE_DATA_FAIL = 'FETCH_PREPARE_DATA_FAIL';
export const FETCH_PREPARE_DATA_SUCCESS = 'FETCH_PREPARE_DATA_SUCCESS';

export const fetchPrepareData = (sendingId, mainPackageId) => ({
  type: FETCH_PREPARE_DATA,
  payload: {
    request: {
      method: 'GET',
      url: `${API_ROUTES.queuePrepare}/${sendingId}/${mainPackageId}`,
    },
  },
});
