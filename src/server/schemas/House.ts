import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Houses {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	type!: number;

	@Column()
	class!: number;

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

	@Column()
	dimension!: number;

	@Column('simple-json')
	interior!: {
		x: number;
		y: number;
		z: number;
	};

	@Column()
	price!: number;

	@Column('simple-json')
	garage!: {
		house: {
			x: number;
			y: number;
			z: number;
			a: number;
		};
		vehicle: {
			x: number;
			y: number;
			z: number;
			a: number;
		};
		character: {
			x: number;
			y: number;
			z: number;
			a: number;
		};
		position: {
			x: number;
			y: number;
			z: number;
			a: number;
		};
	};

	@Column()
	locked!: 0 | 1;
}
