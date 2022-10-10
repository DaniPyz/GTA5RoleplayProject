import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { FC, useCallback, useEffect, useState } from 'react';
import { client, server } from 'index';
import { useAppDispatch, useAppSelector, useKeyboard } from 'hooks';

import { FRACTION_DATA } from './Fraction.config';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ItemCell from './../../components/ItemCell/ItemCell';
import { ItemInfo } from 'components';
import { ReactComponent as WeightVector } from './vectors/weight.svg';
import { animated } from 'react-spring';
import cls from 'classnames';
import s from './Fraction.module.scss';
import { setView } from 'index';
import useMasterSpring from './Fraction.spring';

const Fraction: FC = () => {
	const dispatch = useAppDispatch();
	const state = useAppSelector((state) => state.warehouseState);

	const [hasDropped, setHasDropped] = useState(false);
	const [fractionId, setFractionId] = useState(0);
	const [selected, setSelected] = useState(0);
	const [selectedCell, setSelectedCell] = useState<number | null>(null);
	const { hideTransition } = useMasterSpring();

	useKeyboard(
		'esc',
		useCallback(() => {
			setView(null);
		}, [])
	);

	useKeyboard(
		'right',
		useCallback(() => {
			if (selected + 1 === FRACTION_DATA[fractionId].categories.length) {
				setSelected(0);
				return;
			}
			setSelected(Math.min(selected + 1, FRACTION_DATA[fractionId].categories.length));
		}, [selected])
	);

	useKeyboard(
		'left',
		useCallback(() => {
			if (selected === 0) {
				setSelected(FRACTION_DATA[fractionId].categories.length - 1);
				return;
			}
			setSelected(Math.max(selected - 1, 0));
		}, [selected])
	);

	const changeSelection = (index: number) => {
		setSelectedCell(index);
	};

	// dispatch({ type: 'ROOT_HUD_PUSH', hud });
	return hideTransition(
		(style: any, isOpened: boolean) =>
			isOpened && (
				<animated.div style={style} className={s.fraction}>
					<>
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
								{FRACTION_DATA[fractionId].categories.map((el, index) => (
									<button
										onClick={() => setSelected(index)}
										key={index}
										className={`${s.btn_ui} ${index === selected && s.btn_ui_select}`}
									>
										{el}
									</button>
								))}
							</div>
							<div className={s.info}>
								<p>{FRACTION_DATA[fractionId].name}</p>
								<div className={s.info_footer}>
									<h1>Заполненность склада</h1>
									<h2>
										<p>{8}</p>/<div>{FRACTION_DATA[fractionId].maxWeight} кг</div>{' '}
										<span>
											<WeightVector />
										</span>
									</h2>
								</div>
								<div className={s.info_progressBar}>
									<div style={{ width: ` 8%` }} />
								</div>
							</div>
							<div className={s.cells}>
								{Array.from({ length: 72 }, (_, index) => {
									if (state.warehouse && state.warehouse[selected] && state.warehouse[selected][index]) {
										return (
											<section key={index} onClick={() => setSelectedCell(index)}>
												<ItemCell
													index={index}
													change={changeSelection}
													selected={selectedCell}
													img={state.warehouse[selected][index]!.img}
													count={state.warehouse[selected][index]!.count}
													selectedFilter={selected}
												/>
											</section>
										);
									} else {
										return (
											<section key={index + 'new'} onClick={() => setSelectedCell(null)}>
												<ItemCell index={index} change={changeSelection} selectedFilter={selected} />
											</section>
										);
									}
								})}
							</div>
						</div>
						{}
						{selectedCell !== null ? (
							<div className={s.infoDialog}>
								<ItemInfo
									img={state.warehouse[selected][selectedCell]!.img}
									name={state.warehouse[selected][selectedCell]!.name}
									weight={state.warehouse[selected][selectedCell]!.weight}
								/>
							</div>
						) : (
							''
						)}
					</>
				</animated.div>
			)
	);
};

export default Fraction;
