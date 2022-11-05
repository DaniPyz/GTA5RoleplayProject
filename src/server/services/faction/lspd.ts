import { Player } from './../../models/player.model';
import { Service } from 'bridge';

let jails = [
	new mp.Vector3(459.25750732421875, -1001.5284423828125, 24.914859771728516),
	new mp.Vector3(459.3766174316406, -997.9525756835938, 24.914859771728516),
	new mp.Vector3(460.325927734375, -994.3788452148438, 24.914859771728516)
];
let JailExit = {
	pos: new mp.Vector3(443.1412658691406, -982.986083984375, 29.689594268798828),
	heading: 80
};

@Service.namespace
class Lspd extends Service {
	constructor() {
		super();

		Player.created((player) => {
			player.isCuff = false;
		});
		mp.events.add({
			'server::new:death': (player) => {
				mp.events.call('chat::fraction:lspd', `Поступил вызов что бы принять напишите /accept ${player.id} .`);
			},
			'server::lspd:keyPressed': () => {
				console.log('Привет');
			},
			'server::lspd:jail': (player, nearPlayer, time) => {
				this.jail(player, nearPlayer, time);
			},
			'server::lspd:giveStars': (player, targetPlayer, stars) => {
				this.giveStars(player, targetPlayer, stars);
			}
		});
	}

	// user.setClothes(player, clothes, false)

	@Service.access
	public rpcCuffPlayer(player: PlayerServer) {
		player.client.lspd.cuffPlayer();
		player.isCuff = !player.isCuff;

		if (player.isCuff) {
			player.playAnimation('mp_arresting', 'idle', 1, 53); // или вместо 53 49
		} else {
			player.stopAnimation();
		}
	}

	@Service.access
	public rpcDragCuffedPlayer(player: PlayerServer) {
		player.client.lspd.dragPlayer();
	}
	private getRandomJail() {
		//@ts-ignore
		return jails[mp.getRandomInRange(0, jails.length - 1)];
	}

	private jail = (_player: PlayerServer, nearPlayer: PlayerServer[], time: number) => {
		let jail = this.getRandomJail();

		if (nearPlayer[1] === undefined) return;
		if (!nearPlayer[1].isCuff) return;
		if (nearPlayer[1].wantedStars == 0) return;
		if (jail.subtract(nearPlayer[1].position).length() > 10) return;

		nearPlayer[1].position = jail;
		setTimeout(() => {
			nearPlayer[1].position = JailExit.pos;
			nearPlayer[1].isCuff = false;
		}, time);
	};

	private giveStars = (_player: PlayerServer, targetPlayer: PlayerServer, stars: number) => {
		if (targetPlayer === undefined) return;

		targetPlayer.wantedStars = stars;
	};

	// public playerCallPolice(player: PlayerServer, nearPlayer: PlayerServer): void {
	// 	console.log(player, nearPlayer);
	// 	if (nearPlayer === undefined || nearPlayer._death === false) return;

	// 	player.playAnimation('missheistfbi3b_ig8_2', 'cpr_loop_paramedic', 1, 1);

	// 	setTimeout(() => {
	// 		player.stopAnimation();
	// 		nearPlayer.health = 100;
	// 	}, 7000);
	// }
}
declare global {
	interface PlayerMp {
		isCuff: boolean;
		wantedStars: number;
	}
}

export default Lspd;
