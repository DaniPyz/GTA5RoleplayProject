import { CONFIG_DATABASE_HOST, CONFIG_DATABASE_DB, CONFIG_DATABASE_PASS, CONFIG_DATABASE_PORT, CONFIG_DATABASE_USER } from 'constant';
import { DataSource } from 'typeorm';
import { Business } from './Business';
import { Character } from './Character';
import { Fraction } from './Faction';
import { House } from './House';
import { User } from './User';
import { Vehicle } from './Vehicles';

export const AppDataSource = new DataSource({
	type: 'mariadb',
	host: CONFIG_DATABASE_HOST,
	port: CONFIG_DATABASE_PORT,
	username: CONFIG_DATABASE_USER,
	password: CONFIG_DATABASE_PASS,
	database: CONFIG_DATABASE_DB,
	synchronize: true,
	logging: false,
	entities: [Fraction, Business, Character, House, Vehicle, User],
	migrations: [],
	subscribers: []
});

(async () => {
	// const s = await AppDataSource.initialize();
	// console.log(s);
})();
