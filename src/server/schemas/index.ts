import {
	CONFIG_DATABASE_TYPE,
	CONFIG_DATABASE_HOST,
	CONFIG_DATABASE_DB,
	CONFIG_DATABASE_PASS,
	CONFIG_DATABASE_PORT,
	CONFIG_DATABASE_USER
} from 'constant';
import { DataSource } from 'typeorm';
import { Business } from './Business';
import { Character } from './Character';
import { Fraction } from './Faction';
import { Houses } from './House';
import { Users } from './User';
import { Vehicles } from './Vehicles';

export const AppDataSource = new DataSource({
	type: CONFIG_DATABASE_TYPE,
	host: CONFIG_DATABASE_HOST,
	port: CONFIG_DATABASE_PORT,
	username: CONFIG_DATABASE_USER,
	password: CONFIG_DATABASE_PASS,
	database: CONFIG_DATABASE_DB,
	synchronize: true,
	logging: false,
	entities: [Fraction, Business, Character, Houses, Vehicles, Users],
	migrations: [],
	subscribers: []
});
