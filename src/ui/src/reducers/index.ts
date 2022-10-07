import { combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import rootState from './rootReducer';
import warehouseState from './warehouseReducer';

export const reducers = {
	rootState,
	warehouseState
};

const combinedReducers = combineReducers(reducers);
export default combinedReducers;
