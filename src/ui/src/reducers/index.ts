import { combineReducers } from 'redux';

import rootState from './rootReducer';

export const reducers = {
	rootState
};

const combinedReducers = combineReducers(reducers);
export default combinedReducers;
