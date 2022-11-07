import { useAppSelector } from 'hooks';
import { FC } from 'react';
import style from './Taxi.module.scss';
import { ReactComponent as IconSvg } from './vectors/icon.svg';
import { ReactComponent as LocationSvg } from './vectors/location.svg';
import { ReactComponent as TimeSvg } from './vectors/time.svg';
import { ReactComponent as BackSvg } from './vectors/back.svg';

const Taxi: FC = () => {
	const root = useAppSelector((state) => state.rootState);

	return (
		<div className={style.taxi}>
			<div className={style.wrapper}>
				<div className={style.topPanel}>
					<BackSvg />
					Вызов такси
				</div>

				<div className={style.panel}>
					<div className={style.contacts}>
						<IconSvg />
						<div className={style.columnRight}>
							<div className={style.name}>{root.player.name}</div>
							<div className={style.time}>
								<TimeSvg />
								Примерное время ожидания: ~01:00
							</div>
							<div className={style.location}>
								<LocationSvg />
								Адрес: St. City
							</div>
						</div>
					</div>
					<div className={style.button}>
						<div>
							<div>
								<div>Вызвать такси</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Taxi;
