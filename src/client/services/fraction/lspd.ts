import { Service } from '@/bridge';

let player = mp.players.local;
let isDragging = false;

interface IPlayerMp extends PlayerMp {
	isCuff: boolean;
}
export class Lspd {
	@Service.access
	public rpcDragPlayer(): void {
		//@ts-ignore

		let draggingPlayer: IPlayerMp = mp.players.getClosest([player.position.x, player.position.y, player.position.y], 2)[1];
		if (draggingPlayer === undefined) return;
		isDragging = !isDragging;
		if (!draggingPlayer.isCuff) return;
		if (player.vehicle) {
			draggingPlayer.setIntoVehicle(player.vehicle, 2);
		}
		let interval = setInterval(function () {
			if (isDragging) {
				let pos = player.getOffsetFromInWorldCoords(0, 1, 0);
				if (draggingPlayer.vehicle) {
					draggingPlayer.taskLeaveAnyVehicle(0, 0);
				}
				draggingPlayer.taskGoToCoordAnyMeans(pos.x, pos.y, pos.z, 10.0, 0, true, 1, 0.0);
			} else {
				clearInterval(interval);
			}
		}, 500);
	}
	@Service.access
	public rpcCuffPlayer(): void {
		//@ts-ignore

		let draggingPlayer: IPlayerMp = mp.players.getClosest([player.position.x, player.position.y, player.position.y], 2)[0];
		//@ts-ignore

		if (draggingPlayer === undefined) return;

		draggingPlayer.isCuff = !draggingPlayer.isCuff;

		if (draggingPlayer.isCuff) {
		}
		mp.events.add('render', () => {
			if (draggingPlayer.isCuff) {
				mp.game.controls.disableControlAction(32, 21, draggingPlayer.isCuff);
				mp.game.controls.disableControlAction(32, 22, draggingPlayer.isCuff);
				mp.game.controls.disableControlAction(32, 1, draggingPlayer.isCuff);
				// player.setEnableHandcuffs(isPlayerCuffed);
			}
			return;
		});
	}
}
