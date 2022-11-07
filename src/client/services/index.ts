import { Helpers } from './helpers';
import { Lspd } from './fraction/lspd';
import { Service } from '@/bridge';
import { Temp } from './temp';

const services = {
	Temp,
	Helpers,
	Lspd
};

Service.combineServices(services);

export type ClientServices = typeof services;
