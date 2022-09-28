import { createClientProxy, createServerProxy } from 'bridge/proxy';
import type { ServerServices } from '../../server/services';
import type { ClientServices } from '../../client/services';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from 'store';
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
		setView(view: View): void;
		pushHud(hud: Hud): void;
	}
}

window.setView = (view) => {
	store.dispatch({ type: 'ROOT_VIEW_SET', view });
};

window.pushHud = (hud) => {
	store.dispatch({ type: 'ROOT_HUD_PUSH', hud });
};
