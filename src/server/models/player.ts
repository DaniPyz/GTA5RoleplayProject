import * as rpc from '../../shared/lib/rpc';

import type { Hud, View } from '../../ui/src';

import type { AppDispatch } from '../../ui/src/store';
import type { ClientServices } from '../../client';
import type { RuntimeTypes } from '../../ui/src/bridge/types';
import { createClientProxy } from '../../ui/src/bridge/proxy';

type ClientProxy = RuntimeTypes.IProxyClient<ClientServices>;

declare global {
	interface PlayerMp {
		clientProxy: ClientProxy;
		dispatch(action: ReturnType<AppDispatch>): void;
		setView(view: View): void;
		pushHud(hud: Hud): void;
		removeHud(hud: Hud): void;
	}
}

export const isPlayer = (entity: EntityMp): entity is PlayerMp => entity.type === RageEnums.EntityType.PLAYER;

console.log(RageEnums.EntityType.PLAYER);

mp.events.add('entityCreated', (player) => {
	if (!isPlayer(player)) return;


	player.clientProxy = createClientProxy<ClientServices>({
		callClient: (name: string, args: any, opt: any) => rpc.callClient(player, name, args, opt)
	});

	player.dispatch = (action) => {
		rpc.triggerBrowsers(player, 'internal.dispatch', action);
	};

	player.setView = (view) => {
		rpc.triggerBrowsers(player, 'internal.setView', view);
	};

	// setTimeout(() => {
	// 	console.log('Отработал')
	// 	player.setView('Fraction');
	// }, 10000);

	player.pushHud = (hud) => {
		rpc.triggerBrowsers(player, 'internal.pushHud', hud);
	};

	player.removeHud = (hud) => {
		rpc.triggerBrowsers(player, 'internal.removeHud', hud);
	};
});
