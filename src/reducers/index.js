import {combineReducers} from 'redux';
import user from './user';
import queue from './queue';
import activeQueue from './activeQueue';
import order from './order';
import acceptOrder from './acceptOrder';

export default combineReducers({user, queue, activeQueue, order, acceptOrder});
