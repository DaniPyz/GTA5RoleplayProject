import { Service } from 'bridge';
import { Player } from 'models/player.model';

interface IPlayerPhone {
	activeCall: Call | null;
}

enum CallStatus {
	connecting,
	waiting,
	progress,
	canceled
}

class Call {
	public status: CallStatus = CallStatus.connecting;
	public callerId: string;
	public targetId: string;
	public caller: PlayerServer;
	public target: PlayerServer | null;
	public time: number = 0;

	constructor(caller: PlayerServer, targetId: string) {
		this.caller = caller;
		this.targetId = targetId;
		this.callerId = caller.character.phone.callerId;
		this.target = Player.getPlayerList({ hasAuth: true, hasCharacter: true }).find((p) => p.character.phone.callerId === targetId) || null;
	}

	start() {
		if (this.caller.phone.activeCall) {
			return; // вызвать alert, что игрок недоступен;
		}

		if (!this.target) {
			return; // Абонент не в сети;
		}

		this.status = CallStatus.waiting;

		// Совершить вызов
	}

	cancel() {
		this.status = CallStatus.canceled;
		// this.caller.dispatch({});
		// this.target?.dispatch({});
	}
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
          call.cancel();
				}
			};
		});
	}

	@Service.access
	public rpcSyncMyContacts(player: PlayerServer) {}

	public rpcGetMyDialogList(player: PlayerServer) {}

	public rpcGetDialogMessages(player: PlayerServer) {}

	public rpcSendDialogMessage(player: PlayerServer, callerId: string, message: string) {}

	public rpcRequestCall(player: PlayerServer, callerId: string) {}
}

declare global {
	interface PlayerMp {
		phone: IPlayerPhone;
	}
}

export default Phone;
