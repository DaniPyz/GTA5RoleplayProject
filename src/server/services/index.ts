import { Service } from 'bridge';
import { Faction } from './faction';
import { Phone } from './phone';

const services = {
	Faction,
	Phone
};

Service.combineServices(services);

export type ServerServices = typeof services;
