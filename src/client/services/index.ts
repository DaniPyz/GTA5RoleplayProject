import { Service } from '@/bridge';
import { Temp } from './temp';

const services = {
	Temp
};

Service.combineServices(services);

export type ClientServices = typeof services;
