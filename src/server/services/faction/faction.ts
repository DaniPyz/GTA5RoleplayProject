import { Service } from 'bridge';
const AUTOSALON_LIST = [
	{
		name: 'San Andreas',
		pos: new mp.Vector3(0, 100, 100),
		// vehiclePos: new mp.Vector3(-43.445411682128906, -1096.7337646484375, 26.422353744506836),
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
			const autosalonShape = mp.colshapes.newTube(autosalon.pos.x, autosalon.pos.y, autosalon.pos.z, 1000, 20, 0);
			mp.blips.new(1, autosalon.pos);
			autosalonShapes.set(autosalonShape, autosalon);
		}
		mp.events.add('playerEnterColshape', (player: PlayerServer, colshape: RageEnums.ColshapeType) => this.enterInAutosalon(player, colshape));
	}

	// @Service.access
	public enterInAutosalon(player: PlayerServer, colshape: RageEnums.ColshapeType): void {
		const autosalon = autosalonShapes.get(colshape);

		if (autosalon) {
			player.setView(null);
		}
	}

	// @Service.access
	// public async rpcGetUserdAWD() {
	// 	return;
	// }

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
