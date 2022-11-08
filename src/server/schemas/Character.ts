import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Message {
	@Column() public text: string = '';
}

@Entity()
class Dialog {
	constructor(targetId: string) {
		this.targetId = targetId;
	}

	@Column() public targetId: string;
	@Column() public lastTimestamp: string = '';
	@Column() public messageList: Message[] = [];
}

@Entity()
class Phone {
	@Column() public callerId: string = '';
	@Column('simple-json') public dialogList: Dialog[] = [];
}

@Entity()
export class Character {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	userid!: number;

	@Column('simple-array')
	name!: string[];

	@Column({ default: 0 })
	gender!: 0 | 1;

	@Column({ default: 0 })
	age!: number;

	@Column('simple-json')
	skin!: {
		genetic: {
			mother: number;
			father: number;
			similarity: number;
			skinTone: number;
		};
		hair: {
			head: number;
			beard: number;
			eyebrow: number;
			breast: number;
			head_color: number;
			beard_color: number;
			eyebrow_color: number;
			breast_color: number;
		};
		appearance: number[];
		face: number[];
	};

	@Column('simple-json', { default: () => '{}' })
	clothes!: {
		tops: number;
		torsos: number;
		undershirts: number;
		legs: number;
		shoes: number;
	};

	@Column('datetime')
	birthday!: string;

	@Column({ default: 1 })
	level!: number;

	@Column({ default: 0 })
	exp!: number;

	@Column({ default: 200 })
	cash!: number;

	@Column({ default: 0 })
	bankcash!: number;

	@Column({ default: 1 })
	createchar!: number;

	@Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
	lastDate!: string;

	@Column('simple-json', { default: () => '{}' })
	quests!: {
		testquest: {
			name: string;
			desc: string;
			prize: { money: number };
			status: boolean;
			traking: boolean;
			tasks: { name: string; count: [number, number] }[];
			id: string;
		};
	};

	@Column('simple-json', { default: () => '[]' })
	questsOld!: string[];

	@Column('simple-json', { default: () => '[]' })
	inventory!: {
		name: string;
		type: string;
		drop: string;
		weight: number;
		img: string;
		desc: string;
		info: {
			name: string;
			value: string;
		}[];
		id: number;
		data: object;
		count: number;
		status: number;
	}[];

	@Column('simple-json', { default: () => '[]' })
	backpack!: {
		name: string;
		type: string;
		drop: string;
		weight: number;
		img: string;
		desc: string;
		info: {
			name: string;
			value: string;
		}[];
		id: number;
		data: object;
		count: number;
		status: number;
	}[];

	@Column({ default: 0 })
	backpackStatus!: number;

	@Column({ default: '{ "status": false, "data": [], "time": 0 }', type: 'simple-json' })
	donateRoullete!: {
		status: boolean;
		data: {
			name: string;
			type: string;
			img: string;
		}[];
	};

	@Column({ default: () => '[]', type: 'simple-json' })
	fraction!: [number, string, number];

	@Column('simple-json') public phone: Phone = new Phone();
}

console.log(123);
