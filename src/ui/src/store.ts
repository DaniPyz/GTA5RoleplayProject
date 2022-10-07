import { applyMiddleware, legacy_createStore } from 'redux';

import combinedReducers from './reducers';
import { composeWithDevTools } from '@redux-devtools/extension';

declare global {
	interface Window {
		store: typeof store;
	}
}

export const store = legacy_createStore(
	combinedReducers,
	composeWithDevTools(
		// applyMiddleware(...middleware)
	)
);

window.store = store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type WarehouseState = ReturnType<typeof store.getState>;
