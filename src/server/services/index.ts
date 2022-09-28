import { Service } from 'bridge';
import { Faction } from './faction';

const services = {
	Faction
};

Service.combineServices(services);

export type ServerServices = typeof services;
