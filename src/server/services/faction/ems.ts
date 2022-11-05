import { Service } from 'bridge';
// const AUTOSALON_LIST = [
// 	{
// 		name: 'San Andreas',
// 		pos: new mp.Vector3(-20.840431213378906, -699.7188720703125, 250.41355895996094),
// 		vehicleHeading: 195
// 	}
// ];

@Service.namespace
class Ems extends Service {
	autosalonShapes: Map<string, string>;

	constructor() {
		super();
		this.autosalonShapes = new Map();

		mp.events.add({
			'server::new:death': (player) => {
				mp.events.call('chat::fraction:ems', `Человек умер напишите /accept ${player.id} что бы принять вызов`);
			},
			'playerStartedResuscitation': (player: PlayerServer, nearPlayer: PlayerServer) => {
				this.playerStartedResuscitation(player, nearPlayer);
			},
			'givePlayerPill': (nearPlayer: PlayerServer) => {
				this.givePillToPlayer(nearPlayer);
			}
		});
	}

	public playerStartedResuscitation(player: PlayerServer, nearPlayer: PlayerServer): void {
		console.log(player, nearPlayer);
		if (nearPlayer === undefined || nearPlayer._death === false) return;

		player.playAnimation('missheistfbi3b_ig8_2', 'cpr_loop_paramedic', 1, 1);

		setTimeout(() => {
			player.stopAnimation();
			nearPlayer.health = 100;
		}, 7000);
	}
	public givePillToPlayer(nearPlayer: PlayerServer): void {
		if (nearPlayer === undefined || nearPlayer._death === true) return;

		nearPlayer.health = 100;
	}
}
declare global {
	interface PlayerMp {
		_death: boolean;
	}
}
export default Ems;
