// type LockerType = { name: string; img: string; weight: number; coWarehouseunt: number }[];
interface LockerType {
	id: number;
	name: string;
	img: string;
	weight: number;
	count: number;
}
type LockerReducerActions = ArrayToUnion<
	[
		{
			type: 'LOCKER_ADD';
			locker: any;
			fractionId: number;
		},
		{
			type: 'LOCKER_CHANGE';
			data: {
				index: number;
				indexNew: number;
				selectedFilter: number;
			};
		}
	]
>;

interface ILockerState {
	locker: (LockerType | null)[];
	fractionId: number;
}

const initial: ILockerState = {
	locker: [
		{
			id: 1,
			name: 'Курточка',
			img: 'aid.png',
			weight: 12,
			count: 2
		},
		{
			id: 2,
			name: 'Желетка',
			img: 'jacket.png',
			weight: 2,
			count: 1
		},
		null,
		null,
		null,
		null
	],
	fractionId: 0
};
const LockerReducer = (state = initial, action: LockerReducerActions): ILockerState => {
	switch (action.type) {
		case 'LOCKER_ADD': {
			return {
				...state,
				locker: action.locker,
				fractionId: action.fractionId
			};
		}
		case 'LOCKER_CHANGE': {
			let newArr = [...state.locker];

			newArr[action.data.indexNew] = newArr[action.data.index];
			newArr[action.data.index] = null;

			return {
				locker: newArr,
				fractionId: state.fractionId
			};
		}

		default: {
			return state;
		}
	}
};

export default LockerReducer;
