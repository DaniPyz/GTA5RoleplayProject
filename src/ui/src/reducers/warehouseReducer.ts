// type WarehouseType = { name: string; img: string; weight: number; count: number }[];
interface WarehouseType {
	id: number;
	name: string;
	img: string;
	weight: number;
	count: number;
}
type WarehouseReducerActions = ArrayToUnion<
	[
		{
			type: 'WAREHOUSE_ADD';
			warehouse: any;
			fractionId: number;
		},
		{
			type: 'WAREHOUSE_CHANGE';
			data: {
				index: number;
				indexNew: number;
				selectedFilter: number;
			};
		}
	]
>;

interface IWarehouseState {
	warehouse: (WarehouseType | null)[][];
	fractionId: number;
}

const initial: IWarehouseState = {
	warehouse: [
		[
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
		[
			{
				id: 1,
				name: 'Курточка',
				img: 'jacket.png',
				weight: 12,
				count: 2
			},
			null,
			{
				id: 2,
				name: 'Желетка',
				img: 'jacket.png',
				weight: 2,
				count: 1
			},
			null,
			null
		]
	],
	fractionId: 0
};
const WarehouseReducer = (state = initial, action: WarehouseReducerActions): IWarehouseState => {
	switch (action.type) {
		case 'WAREHOUSE_ADD': {
			return {
				...state,
				warehouse: action.warehouse,
				fractionId: action.fractionId
			};
		}
		case 'WAREHOUSE_CHANGE': {
			let newArr = [...state.warehouse];

			newArr[action.data.selectedFilter][action.data.indexNew] = newArr[action.data.selectedFilter][action.data.index];
			newArr[action.data.selectedFilter][action.data.index] = null;

			return {
				warehouse: newArr,
				fractionId: state.fractionId
			};
		}

		default: {
			return state;
		}
	}
};

export default WarehouseReducer;
