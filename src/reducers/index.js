import { combineReducers } from 'redux';
import filters from './filters';
import bugs from './bugs';

export default combineReducers({ filters, bugs });
