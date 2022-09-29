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
	public async rpcGetUser(player: PlayerMp): Promise<PlayerMp> {
		return player;
	}
}

export default Faction;
