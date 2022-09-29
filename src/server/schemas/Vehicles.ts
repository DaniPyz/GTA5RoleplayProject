import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vehicles {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	model!: number | string;

	@Column('simple-json')
	position!: {
		x: number;
		y: number;
		z: number;
	};

	@Column()
	heading!: number;

	@Column()
	dimension!: number;

	@Column('simple-json')
	owner!: string;

	@Column()
	locked!: 0 | 1;

	@Column()
	number!: number | string;

	@Column()
	color!: [[number, number, number], [number, number, number]] | string;

	@Column()
	mileage!: number;

	@Column()
	fuel!: number;
}