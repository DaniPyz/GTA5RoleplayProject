import { legacy_createStore } from 'redux';
import combinedReducers from './reducers';

declare global {
	interface Window {
		store: typeof store;
	}
}

export const store = legacy_createStore(combinedReducers);

window.store = store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
