import { createClientProxy, createServerProxy } from 'bridge/proxy';
import type { ServerServices } from '../../server/services';
import type { ClientServices } from '../../client/services';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { AppDispatch, store } from 'store';
import { Router } from 'components';
import rpc from 'rage-rpc';
import React from 'react';
import './styles/index.scss';
import { HUD_LIST, VIEW_LIST } from 'constant';

import { AppDispatch, store } from 'store';
import { Fraction, Temp } from 'views';
import { createClientProxy, createServerProxy } from 'bridge/proxy';

import type { ClientServices } from '../../client/services';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'components';
import type { ServerServices } from '../../server/services';
import rpc from 'rage-rpc';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

export const server = createServerProxy<ServerServices>(rpc);
export const client = createClientProxy<ClientServices>(rpc);

export type View = keyof typeof VIEW_LIST | null;
export type Hud = keyof typeof HUD_LIST;

declare global {
	interface Window {
		dispatch(action: ReturnType<AppDispatch>): void;
		setView(view: View): void;
		pushHud(hud: Hud): void;
		removeHud(hud: Hud): void;
	}
}

export const setView = window.setView;
export const pushHud = window.pushHud;
export const removeHud = window.removeHud;

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

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<Router hudList={HUD_LIST} views={VIEW_LIST} />
		</Provider>
	</React.StrictMode>
);
