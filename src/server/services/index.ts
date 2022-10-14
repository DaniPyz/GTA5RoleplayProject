import { Ems } from './faction';
import { Faction } from './faction';
import { Service } from 'bridge';

const services = {
	Faction,
	Ems
};

Service.combineServices(services);

export type ServerServices = typeof services;
