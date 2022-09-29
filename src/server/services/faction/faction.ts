import { Service } from 'bridge';

@Service.namespace
class Faction extends Service {
	awdawdawd() {}
	public awadawd() {}
	static awdawd() {}

	constructor() {
		super();

		this.services;
	}

	@Service.access
	public async rpcGetUserdAWD() {
		return;
	}

	@Service.access
	public async rpcGetUser(player: PlayerServer): Promise<PlayerServer> {
		player.dispatch({
			type: "ROOT_HUD_PUSH",
			hud: "Temp",
		});
		player.pushHud("Temp");
		player.pushHud("Temp2");
		player.setView("Temp");
		player.setView(null);
		player.removeHud("Temp2");
		let s = await player.clientProxy.temp.awdadw();

		return player;
	}
}

export default Faction;
