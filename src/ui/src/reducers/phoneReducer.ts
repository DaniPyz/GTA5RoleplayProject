import appList, { AppList } from 'views/Phone/apps';

type RootReducerActions = ArrayToUnion<
	[
		{
			type: 'PHONE_APP_SET';
			app: keyof typeof appList;
		},
		{
			type: 'PHONE_WALLPAPER_SET';
			wallpaper: number;
		}
	]
>;

interface IRootState {
	app: AppList;
	wallpaper: number;
}

const initial: IRootState = {
	app: 'Home',
	wallpaper: 0
};

const RootReducer = (state = initial, action: RootReducerActions): IRootState => {
	switch (action.type) {
		case 'PHONE_APP_SET': {
			return {
				...state,
				app: action.app
			};
		}

		case 'PHONE_WALLPAPER_SET': {
			return {
				...state,
				wallpaper: action.wallpaper
			};
		}

		default: {
			return state;
		}
	}
};

export default RootReducer;
