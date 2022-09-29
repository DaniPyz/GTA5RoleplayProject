import type { Hud, View } from '../../ui/src';
import type { RuntimeTypes } from '../../ui/src/bridge/types';
import { createClientProxy } from '../../ui/src/bridge/proxy';
import type { AppDispatch } from '../../ui/src/store';
import type { ClientServices } from '../../client';
import rpc from 'rage-rpc';

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

export const isPlayer = (entity: EntityMp): entity is PlayerMp => {
	if (entity.type === RageEnums.EntityType.PLAYER) {
		return true;
	} else {
		return false;
	}
};

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

	player.pushHud = (hud) => {
		rpc.triggerBrowsers(player, 'internal.pushHud', hud);
	};

	player.removeHud = (hud) => {
		rpc.triggerBrowsers(player, 'internal.removeHud', hud);
	};
});
