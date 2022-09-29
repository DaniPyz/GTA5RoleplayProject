import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Fraction {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	type!: number;

	@Column()
	name!: string;

	@Column()
	description!: string;

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

	@Column('simple-json')
	leader!: {
		id: number;
		name: string;
	};

	@Column()
	maxRang!: number;

	@Column()
	balance!: number;

	@Column()
	stock!: number;

	// @Column()
	// users: {
	//     id: number,
	//     name: string,
	//     rank: number,
	//     status: number
	// };
}
