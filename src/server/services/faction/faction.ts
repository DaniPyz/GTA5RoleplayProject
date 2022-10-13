import { Service } from 'bridge';
const AUTOSALON_LIST = [
	{
		name: 'San Andreas',
		pos: new mp.Vector3(-20.840431213378906, -699.7188720703125, 250.41355895996094),
		vehicleHeading: 195
	}
];

const autosalonShapes = new Map();
// export interface IFaction {

// }
@Service.namespace
class Faction extends Service {
	autosalonShapes: Map<string, string>;

	constructor() {
		super();
		this.autosalonShapes = new Map();

		for (let autosalon of AUTOSALON_LIST) {
			const autosalonShape = mp.colshapes.newSphere(autosalon.pos.x, autosalon.pos.y, autosalon.pos.z, 2, 0);
			mp.blips.new(1, autosalon.pos);
			mp.markers.new(1, autosalon.pos, 1);
			autosalonShapes.set(autosalonShape, autosalon);
		}
		mp.events.add('playerEnterColshape', (player: PlayerServer, colshape: RageEnums.ColshapeType) => this.enterInAutosalon(player, colshape));
	}

	// @Service.access
	public enterInAutosalon(player: PlayerServer, colshape: RageEnums.ColshapeType): void {
		const autosalon = autosalonShapes.get(colshape);

		if (autosalon) {
			player.call('server::user:cursor', [true, false]);
			player.setView('Fraction');
		}
	}

	// @Service.access
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

export default Faction;
