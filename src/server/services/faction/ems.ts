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
			}
		});
	}


	

	// public async rpcGetUser(player: PlayerServer): Promise<PlayerServer> {
	// 	player.dispatch({
	// 		type: "ROOT_HUD_PUSH",
	// 		hud: "Temp",
	// 	});
	// player.pushHud("Temp");
	// player.pushHud("Temp2");
	// player.setView("Temp");
	// player.setView(null);
	// player.removeHud("Temp2");
	// let s = await player.clientProxy.temp.awdadw();

	// @Service.access
	// public async rpcGetUser(player: PlayerServer): Promise<PlayerServer> {
	// 	player.dispatch({
	// 		type: 'ROOT_HUD_PUSH',
	// 		hud: 'Temp'
	// 	});
	// 	player.pushHud();
	// 	player.pushHud('Temp2');
	// 	player.setView('Temp');
	// 	player.setView(null);
	// 	player.removeHud('Temp2');
	// 	// let s = await player.clientProxy.temp.awdadw();

	// 	return player;
	// }
}

export default Ems;
