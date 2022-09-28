import { createClientProxy, createServerProxy } from 'bridge/proxy';
import type { ServerServices } from '../../server/services';
import type { ClientServices } from '../../client/services';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { AppDispatch, store } from 'store';
import { Temp } from 'views';
import { Router } from 'components';
import rpc from 'rage-rpc';
import React from 'react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

export const server = createServerProxy<ServerServices>(rpc);
export const client = createClientProxy<ClientServices>(rpc);

let Temp2 = Temp;

const hudList = {
	Temp,
	Temp2
};

const views = {
	Temp,
	Temp2
};

export type View = keyof typeof views | null;
export type Hud = keyof typeof hudList;

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<Router hudList={hudList} views={views} />
		</Provider>
	</React.StrictMode>
);

declare global {
	interface Window {
		dispatch(action: ReturnType<AppDispatch>): void;
		setView(view: View): void;
		pushHud(hud: Hud): void;
		removeHud(hud: Hud): void;
	}
}

window.setView = (view) => {
	store.dispatch({ type: 'ROOT_VIEW_SET', view });
};

window.pushHud = (hud) => {
	store.dispatch({ type: 'ROOT_HUD_PUSH', hud });
};

window.dispatch = store.dispatch;

window.removeHud = (hud) => {
	store.dispatch({ type: 'ROOT_HUD_REMOVE', hud });
};

rpc.on('internal.dispatch', (action: ReturnType<AppDispatch>) => {
	window.dispatch(action);
});

rpc.on('internal.setView', (view: View) => {
	window.setView(view);
});

rpc.on('internal.pushHud', (hud: Hud) => {
	window.pushHud(hud);
});

rpc.on('internal.removeHud', (hud: Hud) => {
	window.removeHud(hud);
});
