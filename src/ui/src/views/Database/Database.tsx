import { FC, useCallback, useEffect, useState } from 'react';
import { useAppSelector, useKeyboard } from 'hooks';

import { ReactComponent as BateryVector } from './vectors/battery.svg';
import ItemCell from '../../components/ItemCell/ItemCell';
import { ItemInfo } from 'components';
import { ReactComponent as LocationVector } from './vectors/Location.svg';
import { ReactComponent as SignalVector } from './vectors/signal.svg';
import { ReactComponent as WifiVector } from './vectors/wifi.svg';
import { animated } from 'react-spring';
import s from './Database.module.scss';
import { setView } from 'index';
import useMasterSpring from './Database.spring';
import userImage from './vectors/user.png';

const Database: FC = () => {
	// const state = useAppSelector((state) => state.lockerState);


	const [menu, setMenu] = useState<string>('spy');
	const { hideTransition } = useMasterSpring();



	useKeyboard(
		'esc',
		useCallback(() => {
			setView(null);
		}, [])
	);




	return hideTransition(
		(style, isOpened) =>
			isOpened && (
				<animated.div style={style} className={s.database}>

					<div className={s.mainContent}>

						<div className={s.header}>
							<div>
								<p>12.50</p>
								<LocationVector />
							</div>
							<div>
								<SignalVector />
								<WifiVector />
								<BateryVector />
							</div>
						</div>
						<div className={s.top}>
							<div>
								Database
							</div>
							<div>
								<input placeholder='Поиск по базе данных / Имя Фамилия / Номер телефона' type="text" />
								<button>Назад в меню</button>

							</div>
						</div>
						<div className={s.main}>
							<div className={s.mainLeft}>
								<img src={userImage} alt="" />
								<div>
									<p>Имя фамилия</p>
									<h1>Romario Richardson</h1>
								</div>
								<div>
									<p>Должность</p>
									<h1>Кадет</h1>
								</div>
								<div>
									<p>На службе</p>
									<h1>Нет</h1>
								</div>
								<div>
									<p>Арестов</p>
									<h1>0</h1>
								</div>
								<div>
									<p>Штрафов</p>
									<h1>0</h1>
								</div>
							</div>
							<div className={s.mainRight}>
								<div style={menu !== 'main' ? { display: 'none' } : {}} className={s.mainSection}>
									<div>
										<span></span>
										<div>
											<p>Имя фамилия</p>
											<h1>GPS</h1>
										</div>

									</div>
									<div>
										<span></span>
										<div>
											<p>Имя фамилия</p>
											<h1>GPS-Трекеры</h1>
										</div>

									</div>
									<div>
										<span></span>
										<div>
											<p>Имя фамилия</p>
											<h1>База штрафов</h1>
										</div>

									</div>
									<div>
										<span></span>
										<div>
											<p>Имя фамилия</p>
											<h1>База данных</h1>
										</div>

									</div>
									<div>
										<span></span>
										<div>
											<p>Имя фамилия</p>
											<h1>Ориентировки</h1>
										</div>

									</div>
									<div>
										<span></span>
										<div>
											<p>Имя фамилия</p>
											<h1>Оповещения</h1>
										</div>

									</div>
								</div>
								<div style={menu !== 'calls' ? { display: 'none' } : {}} className={s.callsSection}>
									<div className={s.callsInfo}>
										<h1>От кого вызов</h1>
										<h2>Расстояние</h2>
										<h3>Комментарий</h3>
										<h4>Действие</h4>
									</div>
									{
										Array.from(Array(10).keys()).map(() => (
											<div className={s.callsItem}>
												<h1>Rogers Andrew</h1>
												<h2>150 м.</h2>
												<span>Носилуют, памагити!</span>
												<button>Принять</button>
											</div>
										)
										)
									}
								</div>
								<div style={menu !== 'tickets' ? { display: 'none' } : {}} className={s.ticketsSection}>
									<div className={s.ticketsInfo}>
										<h1>Выписал</h1>
										<h2>Кому</h2>
										<h3>Причина</h3>
										<h4>Сумма</h4>
									</div>
									{
										Array.from(Array(10).keys()).map(() => (
											<div className={s.ticketsItem}>
												<h1>Rogers Andrew</h1>
												<h2>A. Richardson</h2>
												<span>12.5.1</span>
												<h3>$666.666.666</h3>
											</div>
										)
										)
									}
								</div>
								<div style={menu !== 'spy' ? { display: 'none' } : {}} className={s.spySection}>
									<div className={s.spyInfo}>
										<h1>Cотрудник</h1>
										<h2>Модель</h2>
										<h3>Расстояние</h3>
										<h4>Действие</h4>
									</div>
									{
										Array.from(Array(10).keys()).map(() => (
											<div className={s.spyItem}>
												<h1>Rogers Andrew</h1>
												<h2>Mitubishi Lancer X</h2>
												<span>666 метров</span>
												<button>Отследить</button>
											</div>
										)
										)
									}
								</div>
							</div>
						</div>
						<div className={s.bottom}>
							<div>
								<button>Code-0</button>
								<button>Code-1</button>
								<button>Code-2</button>
								<button>Code-3</button>
							</div>
							<button className={s.mainBtn}>Code-4</button>

						</div>
					</div>

				</animated.div >
			)
	);
};

export default Database;
