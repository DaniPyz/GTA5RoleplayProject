import { Service } from 'bridge';
import { Player } from 'models/player.model';

interface IPhoneCall {
	caller: PlayerServer;
	target: PlayerServer;
	time: number;
}

interface IPlayerPhone {
	activeCall: IPhoneCall | null;
}

@Service.namespace
class Phone extends Service {
	constructor() {
		super();

		Player.created((player) => {
			player.phone = {
				activeCall: null
			};

			return (player) => {
				const call = player.phone.activeCall;
				if (call) {
					this.cancelCall(call);
				}
			};
		});
	}

	@Service.access
	public rpcSyncMyContacts(player: PlayerServer) {}

	public rpcGetMyDialogList(player: PlayerServer) {}

	public rpcGetDialogMessages(player: PlayerServer) {}

	public rpcSendDialogMessage(player: PlayerServer, callerId: string, message: string) {}

	public rpcRequestCall(player: PlayerServer, callerId: string) {
		if (player.phone.activeCall) {
			return; // вызвать alert, что игрок недоступен;
		}

		const target = Player.getPlayerList({ hasAuth: true, hasCharacter: true }).find((p) => p.character.phone.callerId === callerId);

		if (!target) {
			return; // Абонент не в сети;
		}

		// Совершить вызов
	}

	private cancelCall(call: IPhoneCall) {}
}

declare global {
	interface PlayerMp {
		phone: IPlayerPhone;
	}
}

export default Phone;
