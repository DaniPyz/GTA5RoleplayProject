import appList, { AppList } from 'views/Phone/apps';
import { soundList } from 'views/Phone/apps/Settings/Settings';

type RootReducerActions = ArrayToUnion<
	[
		{
			type: 'PHONE_APP_SET';
			app: keyof typeof appList;
		},
		{
			type: 'PHONE_WALLPAPER_SET';
			wallpaper: number;
		},
		{
			type: 'PHONE_AIRMODE_SET';
			value: boolean;
		},
		{
			type: 'PHONE_SOUND_SET';
			value: number;
		}
	]
>;

interface IMessage {
	text: string;
	timestamp: string;
}

interface IDialog {
	name: string;
	checked: boolean;
	messages: IMessage[];
}

interface IRootState {
	app: AppList;
	wallpaper: number;
	airmode: boolean;
	sound: number;
	dialogs: IDialog[];
}

const initial: IRootState = {
	app: 'Home',
	wallpaper: 0,
	airmode: false,
	sound: 0,
	dialogs: [
		{ name: 'awdadw', checked: false, messages: [{ text: 'awdawdawdaw124235d', timestamp: '' }] },
		{ name: 'awdadw1', checked: true, messages: [{ text: 'awdawdawegregredawd', timestamp: '' }] },
		{ name: 'awdadw2', checked: false, messages: [{ text: 'awdawdawgregredawd', timestamp: '' }] }
	]
};

const RootReducer = (state = initial, action: RootReducerActions): IRootState => {
	switch (action.type) {
		case 'PHONE_APP_SET': {
			return {
				...state,
				app: action.app
			};
		}

		case 'PHONE_SOUND_SET': {
			let value = action.value;

			if (action.value >= soundList.length) {
				value = 0;
			}

			console.log(value);

			return {
				...state,
				sound: value
			};
		}

		case 'PHONE_WALLPAPER_SET': {
			return {
				...state,
				wallpaper: action.wallpaper
			};
		}

		case 'PHONE_AIRMODE_SET': {
			return {
				...state,
				airmode: action.value
			};
		}

		default: {
			return state;
		}
	}
};

export default RootReducer;
