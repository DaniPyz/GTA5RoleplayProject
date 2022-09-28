import { combineReducers } from 'redux';

import rootState from './rootReducer';

const reducers = {
	rootState
};

const combinedReducers = combineReducers(reducers);
export default combinedReducers;
