import { Autosalon, Database, Fraction, Locker, Temp } from 'views';
import { Hud, View } from 'index';

export const DEFAULT_VIEW: View = 'Database';
export const DEFAULT_HUD_LIST: Hud[] = [];

export const HUD_LIST = {
	Temp
};

export const VIEW_LIST = {
	Temp,
	Locker,
	Autosalon,
	Fraction,
	Database
};
