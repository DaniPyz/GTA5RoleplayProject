import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	username!: string;

	@Column('varchar', { length: 200 })
	password!: string;

	@Column('varchar', { length: 70 })
	email!: string;

	@Column()
	promo!: string;

	@Column()
	regIP!: string;

	@Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
	regDate!: string;

	@Column({ default: '[0]' })
	buy_slots_chars!: [];

	@Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
	lastDate!: string;

	@Column()
	lastIP!: string;

	@Column('simple-json', { default: () => '{}' })
	settings!: {
		hud_toggleHint?: boolean;
		hud_toggle: boolean;
		hud_toggleChatChoice?: boolean;
		trade_privacy?: boolean;
	};

	@Column()
	admin!: number;

	@Column('varchar', { length: 200 })
	adminPassword!: string;

	@Column('simple-json', { default: () => '{}' })
	adminData!: {
		addDate: string;
		upDate: string;
		reportDay: number;
		reports: number;
		adder: string;
		upper: string;
	};

	@Column()
	adminBan!: 0 | 1;

	@Column({ default: () => -1 })
	online!: number;

	@Column({ default: () => -1 })
	onlineChar!: number;

	@Column({ default: () => '{}' })
	keysSettings!: object;

	@Column({ default: () => 0 })
	donate!: number;

}
