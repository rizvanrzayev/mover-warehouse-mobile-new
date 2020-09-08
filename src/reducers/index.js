import {combineReducers} from 'redux';
import user from './user';
import queue from './queue';
import singleQueue from './singleQueue';
import activeQueue from './activeQueue';
import order from './order';

export default combineReducers({user, queue, singleQueue, activeQueue, order});
