import { AppDataSource } from 'data-source';
import { Service } from 'bridge';
const AUTOSALON_LIST = [
	{
		name: 'San Andreas',
		pos: new mp.Vector3(-20.840431213378906, -699.7188720703125, 250.41355895996094),
		vehicleHeading: 195
	}
];

const autosalonShapes = new Map();
export interface IGivePlayerItem {
	player: PlayerServer;
	id: number;
	count: number;
	data: {};
	onlyInv: boolean;
	customWeight: number;
	canStack: boolean;
}
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
	public async enterInAutosalon(player: PlayerServer, colshape: RageEnums.ColshapeType): Promise<void> {
		const autosalon = autosalonShapes.get(colshape);
		const users = AppDataSource.getRepository('Fraction');
		const user = await users.findOneBy({
			id: 1
		});
		if (user === null) return;

		if (autosalon) {
			player.call('server::user:cursor', [true, false]);
			player.dispatch({ type: 'WAREHOUSE_ADD', warehouse: user.warehouse });
			player.setView('Fraction');
		}
	}
	// player, id, count = 1, data = {}, onlyInv = false, customWeight = 0, canStack = false

	@Service.access
	public async rpcGivePlayerItem(player: PlayerServer, id: number, _fractionId: number, selected: number, selectedCell: number): Promise<void> {
		const users = AppDataSource.getRepository('Fraction');
		const user = await users.findOneBy({
			id: 1
		});
		if (user === null) return;

		let newData = user.warehouse;
		newData[selected][selectedCell] = null;
		user.warehouse = newData;
		await users.save(user);
		player.dispatch({ type: 'WAREHOUSE_ADD', warehouse: newData });

		mp.events.call('serverNew::give:item', player, id, 1, {}, false, 0, false);
	}

	// @Service.access
	// public async rpcDropItem({ player, id }: IGivePlayerItem): Promise<void> {
	// 	console.log(id);
	// 	mp.events.call('serverNew::give:item', player, id, 1, {}, false, 0, false);
	// }
	// @Service.access
	// public async rpcGetUser(player: PlayerServer): Promise<PlayerServer> {
	// 	player.dispatch({
	// 		type: 'ROOT_HUD_PUSH',
	// 		hud: 'Temp'
	// 	});
	// 	player.pushHud('Temp');
	// 	player.pushHud('Temp2');
	// 	player.setView('Temp');
	// 	player.setView(null);
	// 	player.removeHud('Temp2');
	// 	let s = await player.clientProxy.temp.awdadw();
	// }
}

export default Faction;
