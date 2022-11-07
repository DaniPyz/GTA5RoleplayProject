import { Ems, Faction, Lspd } from './faction';

import { Service } from 'bridge';

//@ts-ignore
mp.getRandomInRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const services = {
	Faction,
	Ems,
	Lspd
};

Service.combineServices(services);

export type ServerServices = typeof services;
