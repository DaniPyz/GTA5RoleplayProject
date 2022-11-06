import { default as Browser } from './Browser';
import { default as Telephone } from './Telephone';
import { default as Home } from './Home';
import { default as Messages } from './Messages';
import { default as Settings } from './Settings';
import { default as Taxi } from './Taxi';

const appList = { Browser, Telephone, Home, Messages, Settings, Taxi };

export type AppList = keyof typeof appList;

export default appList;
