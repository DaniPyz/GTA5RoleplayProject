import { Service, server } from '@/bridge';

export class Temp {
	@Service.access
	public rpcAwdadw() {
		server.phone.requestCall('09009');
		return 123;
	}

	@Service.access
	public rpcGefwewf() {
		server.phone.requestCall('222222');
		return 123;
	}
}
