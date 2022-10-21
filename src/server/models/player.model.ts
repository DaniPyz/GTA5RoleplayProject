import type { Hud, View } from '../../ui/src';
import type { RuntimeTypes } from '../../ui/src/bridge/types';
import { createClientProxy } from '../../ui/src/bridge/proxy';
import type { AppDispatch } from '../../ui/src/store';
import type { ClientServices } from '../../client';
import * as rpc from '../../shared/lib/rpc';
import { User } from 'schemas/User';
import { Character } from 'schemas/Character';

type ClientProxy = RuntimeTypes.IProxyClient<ClientServices>;

interface IConfirmProps {
	title?: string;
	text: string;
	buttonLabels?: { accept: string; deciline: string };
}

interface IAlertProps {
	type?: string;
	title?: string;
	text: string;
}

type AlertCallback = (props: IAlertProps) => void;
type ConfirmCallback = (props: IConfirmProps) => Promise<Boolean>;

declare global {
	interface PlayerMp {
		/**
		 * Предоставляет прокси для удаленного вызова функций на стороне клиента
		 */
		client: ClientProxy;

		/**
		 * Предоставляет удаленный store.dispatch на браузере игрока
		 */
		dispatch(action: ReturnType<AppDispatch>): void;

		/**
		 * Устанавливает View (меню) в браузере игрока
		 */
		setView(view: View): void;

		/**
		 * Добавляет Hud в браузер игрока;
		 */
		pushHud(hud: Hud): void;

		/**
		 * Удаляет Hud из браузера игрока;
		 */
		removeHud(hud: Hud): void;

		/**
		 * Добавить алерт в стопку уведомлений уведомлений основного интерфейса
		 */
		pushAlert: AlertCallback;

		/**
		 * Добавить конфирм в стопку уведомлений основного интерфейса
		 */
		pushConfirm: ConfirmCallback;

		/**
		 * Установить конфирм на весь экран (блокирует управление)
		 */
		setConfirm: ConfirmCallback;

		/**
		 * Установить алерт на весь экран (блок управление);
		 */
		setAlert: AlertCallback;

		/**
		 * Установить алерт на весь экран телефона (блок управление)
		 */
		setPhoneAlert: AlertCallback;

		/**
		 * Добавить алерт в шторку уведомлений nтелефона
		 */
		pushPhoneAlert: AlertCallback;

		/**
		 * Установить конфирм на весь экран телефона
		 */
		setPhoneConfirm: ConfirmCallback;

		/**
		 * Добавить конфирм в шторку уведомлений
		 */
		pushPhoneConfirm: ConfirmCallback;

		/**
		 * Колонки из базы данных игрока
		 */
		user: User;

		/**
		 * Колонки из базы данных активного персонажа
		 */
		character: Character;
	}
}

export class Player {
	/**
	 * Обертка entityCreated, entityDestroyed.
	 * Первый callback вызывается, когда игрок создается, коллбек, который был возвращен, когда игрок уничтожился
	 */
	public static created(callback: (player: PlayerServer) => ((player: PlayerServer) => void) | void) {
		let destroyedCallback: ((player: PlayerServer) => void) | void = undefined;
		mp.events.add('entityCreated', (player) => {
			if (Player.isPlayer(player)) {
				destroyedCallback = callback(player);
				player.pushAlert;
			}
		});
		mp.events.add('entityDestroyed', (player) => {
			if (Player.isPlayer(player)) {
				destroyedCallback && destroyedCallback(player);
			}
		});
	}

	/**
	 * Проверяет EntityMp === PlayerMp
	 */
	public static isPlayer = (entity: EntityMp): entity is PlayerMp => entity.type === RageEnums.EntityType.PLAYER;

	/**
	 * Получает список игроков (авторизованных, играющих за персонажей)
	 */
	public static getPlayerList = ({ hasAuth, hasCharacter }: { hasAuth?: boolean; hasCharacter?: boolean }) => {
		if (hasAuth && !hasCharacter) {
			return mp.players.toArrayFast().filter((player) => player.user);
		}

		if (hasCharacter) {
			return mp.players.toArrayFast().filter((player) => player.user && player.character);
		}

		return mp.players.toArrayFast();
	};

	static {
		mp.events.add('entityCreated', (player) => {
			if (!Player.isPlayer(player)) return;

			player.client = createClientProxy<ClientServices>({
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

			player.setAlert = (_props) => {
				throw new Error('Not implemented');
			};

			player.pushAlert = (_props) => {
				throw new Error('Not implemented');
			};

			player.setConfirm = (_props) => {
				throw new Error('Not implemented');
			};

			player.pushConfirm = (_props) => {
				throw new Error('Not implemented');
			};

			player.setPhoneAlert = (_props) => {
				throw new Error('Not implemented');
			};

			player.setPhoneConfirm = (_props) => {
				throw new Error('Not implemented');
			};

			player.pushPhoneAlert = (_props) => {
				throw new Error('Not implemented');
			};

			player.pushPhoneConfirm = (_props) => {
				throw new Error('Not implemented');
			};
		});
	}
}
