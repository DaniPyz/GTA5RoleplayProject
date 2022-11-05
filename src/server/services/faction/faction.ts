import { AppDataSource } from 'data-source';
import { SHARED_FRACTIONS_DATA } from '@shared/constants';
import { Service } from 'bridge';
const FRACTION_LIST = [
	{
		name: 'Ems',
		pos: new mp.Vector3(-20.840431213378906, -699.7188720703125, 249.41355895996094),
		id: 1,
		sprite: 489,
		color: 1,
		changeClothes: new mp.Vector3(-10.840431213378906, -699.7188720703125, 249.41355895996094)
	},
	{
		name: 'Lspd',
		pos: new mp.Vector3(451.61663818359375, -980.2980346679688, 29.689603805541992),
		id: 2,
		sprite: 60,
		color: 38,
		changeClothes: new mp.Vector3(456.4762268066406, -988.3687133789062, 30.689586639404297)
	}
];

const fractionShapes = new Map();
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
	fractionShapes: Map<string, string>;

	constructor() {
		super();
		this.fractionShapes = new Map();

		for (let fraction of FRACTION_LIST) {
			const fractionWarehouseShape = mp.colshapes.newSphere(fraction.pos.x, fraction.pos.y, fraction.pos.z, 2, 0);

			const fractionClothesShape = mp.colshapes.newSphere(fraction.changeClothes.x, fraction.changeClothes.y, fraction.changeClothes.z, 2, 0);

			mp.blips.new(fraction.sprite, fraction.pos, {
				name: fraction.name,
				shortRange: true,
				color: fraction.color
			});
			mp.markers.new(1, fraction.pos, 1);
			mp.markers.new(1, fraction.changeClothes, 1);
			fractionShapes.set(fractionWarehouseShape, {
				...fraction,
				isWarehouseShape: true
			});
			fractionShapes.set(fractionClothesShape, {
				...fraction,
				isClothesShape: true
			});
		}
		mp.events.add('playerEnterColshape', (player: PlayerServer, colshape: RageEnums.ColshapeType) => {
			this.enterInWarehouse(player, colshape);
			this.enterInChangeClothes(player, colshape);
		});
	}
	public async enterInChangeClothes(player: PlayerServer, colshape: RageEnums.ColshapeType): Promise<void> {
		const fraction = fractionShapes.get(colshape);
		if (!fraction || fraction.isClothesShape !== true) return;
		console.log(player.character);

		if (fraction && player.character.fractionId !== 0 && player.character.fractionRank !== 0) {
			let clothes = SHARED_FRACTIONS_DATA[--player.character.fractionId][--player.character.fractionRank].clothes;
			clothes.map((value, index) => {
				player.setClothes(index, value, 0, 0);
			});
		}
	}
	public async enterInWarehouse(player: PlayerServer, colshape: RageEnums.ColshapeType): Promise<void> {
		const fraction = fractionShapes.get(colshape);
		if (!fraction || fraction.isWarehouseShape !== true) return;

		const users = AppDataSource.getRepository('Fraction');

		const user = await users.findOneBy({
			id: fraction.id
		});
		if (user === null) return;

		if (fraction) {
			// player.call('newserver::user:cursor', true);
			player.dispatch({ type: 'WAREHOUSE_ADD', warehouse: user.warehouse, fractionId: user.id });
			player.setView('Fraction');
		}
	}
	// public async enterInReanimationZone(player: PlayerServer, colshape: RageEnums.ColshapeType): Promise<void> {
	// 	//@ts-ignore
	// 	const deathPlayer = colshape.getVariable('deathPlayerID');
	// 	if (!deathPlayer) return;

	// 	if (deathPlayer) {
	// 		player.call('server::user:toggleActionText', [true, 'E', 'Восп']);
	// 	}
	// }

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
		player.dispatch({ type: 'WAREHOUSE_ADD', warehouse: newData, fractionId: user.id });

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
