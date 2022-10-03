import { FC, useState, useCallback, useEffect } from "react";
import s from "./Autosalon.module.scss";
import { ReactComponent as ExitVector } from "./vectors/exit.svg";
import { ReactComponent as CarVector } from "./vectors/car.svg";
import { ReactComponent as SearchVector } from "./vectors/search.svg";
import { AUTOSALON_VEHICLE_STATS, AUTOSALON_CONFIG, AUTOSALON_COLORS } from "./autosalon.config";
import cls from "classnames";
import { animated } from "react-spring";
import useMasterSpring from "./Autosalon.spring";
import useKeyboard from "hooks/useKeyboard";

const Autosalon: FC = () => {
	const [isOpened, setIsOpened] = useState(true);
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState(0);
	const [color, setColor] = useState(AUTOSALON_COLORS.length - 1);
	const { leftBlockTransition, rightBlockTransition, hideTransition } = useMasterSpring({ isOpened });

	// useEffect(() => {
	// 	return () => {

	// 	};l
	// }, []);

	useKeyboard(
		"esc",
		useCallback(() => {
			setIsOpened(false);
		}, [])
	);

	useKeyboard(
		"right",
		useCallback(() => {
			setSelected(Math.min(selected + 1, AUTOSALON_CONFIG.length));
		}, [selected])
	);

	useKeyboard(
		"left",
		useCallback(() => {
			setSelected(Math.max(selected - 1, 0));
		}, [selected])
	);

	return hideTransition(
		(style, isOpened) =>
			isOpened && (
				<animated.div style={style} className={s.autosalon}>
					<div className={s.designFeturesLayout}>
						<div className={s.verticalLine} />
					</div>
					<div className={s.mainLayout}>
						{leftBlockTransition(
							(style, isOpened) =>
								isOpened && (
									<animated.div className={s.leftColumn} style={style}>
										<div className={s.title}>
											<div className={s.localname}>San Andreas</div>
											<div className={s.label}>Автосалон</div>
										</div>
										<div className={s.search}>
											<input
												className={s.search}
												placeholder="Поиск по названию"
												value={search}
												onChange={(e) => setSearch(e.target.value)}
											></input>
											<SearchVector />
										</div>

										<div className={s.vehicleList}>
											{AUTOSALON_CONFIG.filter((v) => {
												let name = v.vehicleName.toLowerCase();
												let id = v.vehicleId.toLowerCase();

												return name.includes(search.toLowerCase()) || id.includes(search.toLowerCase());
											}).map((vehicle, index) => (
												<div
													onClick={() => setSelected(index)}
													className={cls({ [s.item]: true, [s.selected]: index === selected })}
												>
													<div className={s.carIcon}>
														<CarVector />
													</div>
													<div className={s.wrapper}>
														<div className={s.name}>{vehicle.vehicleName}</div>
														<div className={s.price}>${vehicle.price.toLocaleString()}</div>
													</div>
												</div>
											))}
										</div>

										<div className={s.buy}>Купить</div>
									</animated.div>
								)
						)}
						{rightBlockTransition(
							(style, isOpened) =>
								isOpened && (
									<animated.div style={style} className={s.rightColumn}>
										<div className={s.exitLabel} onClick={() => setIsOpened(false)}>
											<div className={s.text}>Выйти из салона</div>
											<div className={s.icon}>
												<ExitVector />
											</div>
										</div>

										<div className={s.block}>
											<div className={s.stats}>
												<div className={s.header}>
													<div className={s.title}>Характеристики</div>
													<div className={s.text}>Выбранного автомобиля</div>
												</div>

												<div className={s.items}>
													{AUTOSALON_VEHICLE_STATS.map((value) => (
														<div className={s.item}>
															<div className={s.prop}>{value}</div>
															<div className={s.bar}>
																<div className={s.progress} />
															</div>
															<div className={s.value}>125</div>
														</div>
													))}
												</div>
											</div>
											<div className={s.color}>
												<div className={s.header}>
													<div className={s.title}>Покраска кузова</div>
													<div className={s.text}>Выбранного автомобиля</div>
												</div>
												<div className={s.items}>
													{AUTOSALON_COLORS.map((c, index) => (
														<div
															onClick={() => setColor(index)}
															className={cls({ [s.item]: true, [s.selected]: color === index })}
															style={{ background: c }}
														></div>
													))}
												</div>
											</div>
											<div className={s.testDrive}>
												<div className={s.header}>
													<div className={s.title}>Тест-Драйв</div>
													<div className={s.text}>Выбранного автомобиля</div>
												</div>

												<div className={s.button}>Испытать - ${666}</div>
											</div>
										</div>
									</animated.div>
								)
						)}
					</div>
				</animated.div>
			)
	);
};

const withController = (Component: FC) => {
	return Component;
};

export default withController(Autosalon);