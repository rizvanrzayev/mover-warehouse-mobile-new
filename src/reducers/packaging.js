import {
  FETCH_PREPARE_DATA,
  FETCH_PREPARE_DATA_FAIL,
  FETCH_PREPARE_DATA_SUCCESS,
} from 'actions/packaging';

const initialState = {
  sortOrder: [],
  sortPreparePackages: [],
  totalSorted: 0,
  user: {},
  isLoading: false,
  hasError: false,
};

const packaging = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PREPARE_DATA:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case FETCH_PREPARE_DATA_SUCCESS: {
      const {data} = action?.payload?.data;
      const {sortOrder, sortPreparePackages, totalSorted, user} = data;
      console.log('action?.payload?.data: ', action?.payload?.data);
      return {
        ...state,
        sortOrder,
        sortPreparePackages,
        totalSorted,
        user,
        isLoading: false,
        hasError: false,
      };
    }
    case FETCH_PREPARE_DATA_FAIL: {
      console.log('action?.payload: ', action?.payload);
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

export default packaging;
