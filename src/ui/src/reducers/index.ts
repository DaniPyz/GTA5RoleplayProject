import { combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import lockerState from './lockerReducer';
import rootState from './rootReducer';
import warehouseState from './warehouseReducer';
import phoneState from './phoneReducer';

export const reducers = {
	rootState,
	warehouseState,
	lockerState
};

const combinedReducers = combineReducers(reducers);
export default combinedReducers;
