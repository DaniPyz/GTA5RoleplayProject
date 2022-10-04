import { FC, useCallback, useEffect, useState } from 'react';
import { client, server } from 'index';
import { useAppDispatch, useAppSelector, useKeyboard } from 'hooks';

import { FRACTION_DATA } from "./Fraction.config";
import ItemCell from './../../components/ItemCell/ItemCell';
import { ItemInfo } from 'components';
// import { ReactComponent as CarVector } from "./vectors/car.svg";
// import { ReactComponent as ExitVector } from "./vectors/exit.svg";
import { ReactComponent as WeightVector } from "./vectors/weight.svg";
import { animated } from "react-spring";
import cls from "classnames";
import s from "./Fraction.module.scss";
import styles from './Temp.module.scss';
import useMasterSpring from "./Fraction.spring";
import { useSelector } from 'react-redux';

const Fraction: FC = () => {
	const [isOpened, setIsOpened] = useState(true);
	const [fractionId, setFractionId] = useState(0);
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState(0);
	const { leftBlockTransition, rightBlockTransition, hideTransition } = useMasterSpring({ isOpened });


	useKeyboard(
		"esc",
		useCallback(() => {
			setIsOpened(false);
		}, [])
	);

	useKeyboard(
		"right",
		useCallback(() => {
			setSelected(Math.min(selected + 1, FRACTION_DATA[fractionId].categories.length));
		}, [selected])
	);

	useKeyboard(
		"left",
		useCallback(() => {
			setSelected(Math.max(selected - 1, 0));
		}, [selected])
	);

	return hideTransition(
		(style: any, isOpened: boolean) =>
			isOpened && (
				<animated.div style={style} className={s.fraction}>
					<div className={s.designFeturesLayout}>
						<div className={s.verticalLine} />
					</div>

					<div className={s.mainLayout}>
						<div className={s.header}>
							<h1>
								Склад
								<span>Организации</span>
							</h1>
						</div>
						<div className={s.category}>
							{
								FRACTION_DATA[fractionId].categories.map((el, index) => <button onClick={() => setSelected(index)} key={index} className={`${s.btn_ui} ${index === selected && s.btn_ui_select}`}>{el}</button>)
							}
						</div>
						<div className={s.info}>
							<p>{FRACTION_DATA[fractionId].name}</p>
							<div className={s.info_footer}>
								<h1>Заполненность склада</h1>
								<h2><p>{8}</p>/<h3>{FRACTION_DATA[fractionId].maxWeight} кг</h3> <span><WeightVector /></span></h2>
							</div>
							<div className={s.info_progressBar}><div style={{ width: ` 8%` }} /></div>

						</div>
						<div className={s.cells}>

							{Array.from({ length: 72 }, (_, index) => <ItemCell key={index} />)}


						</div>

					</div>
					<div className={s.infoDialog}>
						<ItemInfo img='' name="Крутая куртка" weight={45.4} />
					</div>
				</animated.div>
			)
	);
};

const withController = (Component: FC) => {
	return Component;
};

export default withController(Fraction);
