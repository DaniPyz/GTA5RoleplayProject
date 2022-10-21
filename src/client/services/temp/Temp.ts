import { Service, server } from '@/bridge';

export class Temp {
	@Service.access
	public rpcAwdadw() {
		server.phone.requestCall('09009');
		return 123;
	}
}
