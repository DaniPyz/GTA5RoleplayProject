import { Hud, View } from '../index';

import { DEFAULT_HUD_LIST } from '../constant';
import { DEFAULT_VIEW } from '../constant';

interface IPlayerState {
	name: string;
}

type RootReducerActions = ArrayToUnion<
	[
		{
			type: 'ROOT_VIEW_SET';
			view: View;
		},
		{
			type: 'ROOT_HUD_PUSH';
			hud: Hud;
		},
		{
			type: 'ROOT_HUD_REMOVE';
			hud: Hud;
		}
	]
>;

interface IRootState {
	view: View | null;
	hudList: Hud[];
	player: IPlayerState;
}

const initial: IRootState = {
	view: DEFAULT_VIEW,
	hudList: DEFAULT_HUD_LIST,
	player: {
		name: 'Vladimir Rupasov'
	}
};

const RootReducer = (state = initial, action: RootReducerActions): IRootState => {
	switch (action.type) {
		case 'ROOT_VIEW_SET': {
			return {
				...state,
				view: action.view
			};
		}

		case 'ROOT_HUD_PUSH': {
			return {
				...state,
				hudList: [...new Set([...state.hudList, action.hud])]
			};
		}

		case 'ROOT_HUD_REMOVE': {
			return {
				...state,
				hudList: state.hudList.filter((h) => h !== action.hud)
			};
		}

		default: {
			return state;
		}
	}
};

export default RootReducer;
