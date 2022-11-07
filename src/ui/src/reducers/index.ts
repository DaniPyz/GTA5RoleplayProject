import { combineReducers } from 'redux';
import rootState from './rootReducer';
import warehouseState from './warehouseReducer';
import phoneState from './phoneReducer';

export const reducers = {
	rootState,
	warehouseState,
	phoneState
};

const combinedReducers = combineReducers(reducers);
export default combinedReducers;
