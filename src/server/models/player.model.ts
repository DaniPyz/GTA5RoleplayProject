import type { Hud, View } from '../../ui/src';
import type { RuntimeTypes } from '../../ui/src/bridge/types';
import { createClientProxy } from '../../ui/src/bridge/proxy';
import type { AppDispatch } from '../../ui/src/store';
import type { ClientServices } from '../../client';
import * as rpc from '../../shared/lib/rpc';
import { User } from 'schemas/User';
import { Character } from 'schemas/Character';

type ClientProxy = RuntimeTypes.IProxyClient<ClientServices>;

declare global {
	interface PlayerMp {
		clientProxy: ClientProxy;
		dispatch(action: ReturnType<AppDispatch>): void;
		setView(view: View): void;
		pushHud(hud: Hud): void;
		removeHud(hud: Hud): void;
		user: User;
		character: Character;
	}
}

export class Player {
	public static created(callback: (player: PlayerServer) => ((player: PlayerServer) => void) | void) {
		let destroyedCallback: ((player: PlayerServer) => void) | void = undefined;
		mp.events.add('entityCreated', (player) => {
			if (Player.isPlayer(player)) {
				destroyedCallback = callback(player);
			}
		});
		mp.events.add('entityDestroyed', (player) => {
			if (Player.isPlayer(player)) {
				destroyedCallback && destroyedCallback(player);
			}
		});
	}
	public static isPlayer = (entity: EntityMp): entity is PlayerMp => entity.type === RageEnums.EntityType.PLAYER;
	public static getPlayerList = ({ hasAuth, hasCharacter }: { hasAuth?: boolean; hasCharacter?: boolean }) => {
		if (hasAuth && !hasCharacter) {
			return mp.players.toArrayFast().filter((player) => player.user);
		}

		if (hasCharacter) {
			return mp.players.toArrayFast().filter((player) => player.character);
		}

		return mp.players.toArrayFast();
	};

	static {
		mp.events.add('entityCreated', (player) => {
			if (!Player.isPlayer(player)) return;

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
	}
}
