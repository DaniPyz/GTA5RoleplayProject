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
		},
		{
			type: 'PHONE_TELEPHONE_PAGE_SET';
			page: TelephonePage;
		},
		{
			type: 'PHONE_TELEPHONE_CREATE_CONTACT_SET';
			value: boolean;
		},
		{
			type: 'PHONE_MESSAGES_DIALOG_SET';
			dialog: string;
		},
		{
			type: 'PHONE_MESSAGES_DIALOG_IS_OPENED_SET';
			value: boolean;
		}
	]
>;

interface IMessage {
	id: string;
	text: string;
	isMy: boolean;
	timestamp: number;
}

interface IDialog {
	number: string;
	checked: boolean;
	messages: IMessage[];
}

interface IContact {
	name: string;
	number: string;
}

export enum RecentType {
	accepted,
	missed
}

interface IRecent {
	id: string;
	number: string;
	type: RecentType;
}

export type TelephonePage = 'call' | 'contacts' | 'recent';

interface IRootState {
	app: AppList;
	wallpaper: number;
	airmode: boolean;
	sound: number;
	dialogs: IDialog[];
	isDialogOpened: boolean;
	dialogOpen: string;
	telephone: {
		myNumber: string;
		isCreateContact: boolean;
		recent: IRecent[];
		contacts: IContact[];
		page: TelephonePage;
	};
}

const initial: IRootState = {
	app: 'Home',
	isDialogOpened: false,
	dialogOpen: '',
	wallpaper: 0,
	airmode: false,
	sound: 0,
	dialogs: [
		{
			number: '999999',
			checked: false,
			messages: [
				{ id: '123', isMy: true, text: 'awdawdawdaw124235d', timestamp: 1 },
				{ isMy: true, text: 'awdawdawdaw124235d', timestamp: 143, id: '123456454536' },
				{ isMy: false, id: '436534564', text: 'awdawdawdaw124235d', timestamp: Date.now() }
			]
		},
		{ number: '1234343', checked: true, messages: [{ id: '342342', isMy: true, text: 'awdawdawegregredawd', timestamp: 2 }] },
		{ number: '12123123', checked: false, messages: [{ id: '1234245343', isMy: true, text: 'awdawdawgregredawd', timestamp: 3 }] }
	],
	telephone: {
		myNumber: '999999',
		isCreateContact: false,
		contacts: [
			{
				name: 'Vladimir R',
				number: '9999999'
			},
			{
				name: 'Dawd R',
				number: '2342342'
			}
		],
		page: 'call',
		recent: [
			{
				id: '0',
				number: '999999',
				type: RecentType.missed
			},
			{
				id: '1',
				number: '999999',
				type: RecentType.accepted
			},
			{
				id: '2',
				number: '999999',
				type: RecentType.missed
			}
		]
	}
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

		case 'PHONE_TELEPHONE_PAGE_SET': {
			return {
				...state,
				telephone: {
					...state.telephone,
					page: action.page
				}
			};
		}

		case 'PHONE_TELEPHONE_CREATE_CONTACT_SET': {
			return {
				...state,
				telephone: {
					...state.telephone,
					isCreateContact: action.value
				}
			};
		}

		case 'PHONE_MESSAGES_DIALOG_SET': {
			return {
				...state,
				dialogOpen: action.dialog
			};
		}

		case 'PHONE_MESSAGES_DIALOG_IS_OPENED_SET': {
			return {
				...state,
				isDialogOpened: action.value
			};
		}

		default: {
			return state;
		}
	}
};

export default RootReducer;
