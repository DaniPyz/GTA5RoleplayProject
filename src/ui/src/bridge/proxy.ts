import './tools';
import { RuntimeTypes, System } from './types';

export const createServerProxy = <T extends System.ServicesType>(rpc: any) => {
	const serverProxyCache = new Map<string, InstanceType<typeof Proxy>>();

	return new Proxy(
		{},
		{
			get(_, service: string) {
				if (serverProxyCache.has(service)) {
					return serverProxyCache.get(service);
				} else {
					const proxy = new Proxy(
						{},
						{
							get(_, event: string) {
								const call = (noRet: boolean, ...args: any[]) => {
									const eventName = `${service.capitalize()}${event.capitalize()}`;
									return rpc.callServer(eventName, args, noRet ? { noRet: true } : { timeout: 60 * 1000, noRet: false });
								};

								const f = call.bind(null, false);

								(f as any).noRet = (...args: any[]) => {
									call(true, ...args);
								};

								return f;
							}
						}
					);
					serverProxyCache.set(service, proxy);
					return proxy;
				}
			}
		}
	) as RuntimeTypes.IProxyServer<T>;
};

export const createClientProxy = <T extends System.ServicesType>(rpc: any) => {
	const clientProxyCache = new Map<string, InstanceType<typeof Proxy>>();

	return new Proxy(
		{},
		{
			get(_, service: string) {
				if (clientProxyCache.has(service)) {
					return clientProxyCache.get(service);
				} else {
					const proxy = new Proxy(
						{},
						{
							get(_, event: string) {
								const call = (noRet: boolean, ...args: any[]) => {
									const eventName = `${service.capitalize()}${event.capitalize()}`;
									return rpc.callClient(eventName, args, noRet ? { noRet: true } : { timeout: 60 * 1000, noRet: false });
								};

								const f = call.bind(null, false);

								(f as any).noRet = (...args: any[]) => {
									call(true, ...args);
								};

								return f;
							}
						}
					);
					clientProxyCache.set(service, proxy);
					return proxy;
				}
			}
		}
	) as RuntimeTypes.IProxyClient<T>;
};
