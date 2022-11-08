import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Business {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	type!: number;

	@Column('simple-json')
	owner!: {
		id: number;
		name: string;
	};

	@Column('simple-json')
	position!: {
		x: number;
		y: number;
		z: number;
	};

	@Column('simple-json')
	interior!: {
		x: number;
		y: number;
		z: number;
	};

	@Column()
	dimension!: number;

	@Column()
	locked!: number;

	@Column()
	price!: number;

	@Column()
	balance!: number;

	@Column()
	accountBalance!: number;

	@Column('simple-json', { nullable: true })
	warehouse!: object[];

	@Column('simple-json')
	stats!: {
		mon: number;
		tue: number;
		wed: number;
		thu: number;
		fri: number;
		sun: number;
		sut: number;
		btn: string[];
	};

	@Column('simple-json')
	settings!: {
		products: number;
		feePaid: number;
		bestGoods: string;
		visitors: number;
		btn: string[];
	};
}
