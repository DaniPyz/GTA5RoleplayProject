import './services';
import './models';
import 'reflect-metadata';

import { AppDataSource } from './data-source';

AppDataSource.initialize()
	.then(async () => {
	
	})
	.catch((error) => console.log(error));

export { ServerServices } from './services';
