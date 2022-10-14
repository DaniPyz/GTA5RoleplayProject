import {
	CONFIG_DATABASE_DB,
	CONFIG_DATABASE_HOST,
	CONFIG_DATABASE_PASS,
	CONFIG_DATABASE_PORT,
	CONFIG_DATABASE_TYPE,
	CONFIG_DATABASE_USER
} from 'constant';

// import { Business } from './schemas/Business';
// import { Character } from './schemas/Character';
import { DataSource } from 'typeorm';
import { Fraction } from './schemas/Faction';

// import { Houses } from './schemas/House';
// import { Users } from './schemas/User';
// import { Vehicles } from './schemas/Vehicles';

export const AppDataSource = new DataSource({
	type: CONFIG_DATABASE_TYPE,
	host: CONFIG_DATABASE_HOST,
	port: CONFIG_DATABASE_PORT,
	username: CONFIG_DATABASE_USER,
	password: CONFIG_DATABASE_PASS,
	database: CONFIG_DATABASE_DB,
	synchronize: false,
	logging: false,
	entities: [Fraction],
	// Business, Character, Houses, Vehicles, Users
	migrations: [],
	subscribers: []
});
