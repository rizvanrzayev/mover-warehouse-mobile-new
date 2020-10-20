import {combineReducers} from 'redux';
import user from './user';
import queue from './queue';
import activeQueue from './activeQueue';
import order from './order';
import acceptOrder from './acceptOrder';
import {reducer as permissions} from 'react-redux-permissions';

export default combineReducers({
  user,
  queue,
  activeQueue,
  order,
  acceptOrder,
  permissions,
});
