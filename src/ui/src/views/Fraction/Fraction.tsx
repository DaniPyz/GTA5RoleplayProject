import { FC, useCallback, useEffect, useState } from 'react';
import { useAppSelector, useKeyboard } from 'hooks';

import { FRACTION_DATA } from './Fraction.config';
import ItemCell from './../../components/ItemCell/ItemCell';
import { ItemInfo } from 'components';
import { ReactComponent as WeightVector } from './vectors/weight.svg';
import { animated } from 'react-spring';
// import cls from 'classnames';
import s from './Fraction.module.scss';
import { setView } from 'index';
import useMasterSpring from './Fraction.spring';

const Fraction: FC = () => {
	const state = useAppSelector((state) => state.warehouseState);

	const [fractionId, setFractionId] = useState(0);
	const [selected, setSelected] = useState(0);
	const [selectedCell, setSelectedCell] = useState<number | null>(null);
	const { hideTransition } = useMasterSpring();

	useEffect(() => {

		setFractionId(1 - 1)
		return () => {

		}
	}, [state])

	useKeyboard(
		'esc',
		useCallback(() => {
			setView(null);
		}, [])
	);

	useKeyboard(
		'right',
		useCallback(() => {
			setSelectedCell(null)
			setSelectedCell(null)

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
			setSelectedCell(null)

			if (selected === 0) {
				setSelected(FRACTION_DATA[fractionId].categories.length - 1);
				return;
			}
			setSelected(Math.max(selected - 1, 0));
		}, [selected])
	);

	const changeSelection = (index: number | null) => {

		setSelectedCell(index);
	};


	return hideTransition(
		(style, isOpened) =>
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
										onClick={() => {

											setSelectedCell(null)
											setSelected(index)

										}}
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
							<div className={s.cells}
							>
								{Array.from({ length: 72 }, (_, index: number) => {

									if (state.warehouse && state.warehouse[selected] && state.warehouse[selected][index]) {
										// console.log(selected, index, selectedCell, state.warehouse[selected][index]!.img)

										return (
											<section key={index} onClick={() => changeSelection(index)}>
												<ItemCell
													index={index}
													change={changeSelection}
													selectedCell={selectedCell}
													img={state.warehouse[selected][index]!.img}
													count={state.warehouse[selected][index]!.count}
													selectedFilter={selected}
												/>
											</section>
										);
									} else {
										return (
											<section key={index + 'new'} onClick={() => {

												setSelectedCell(null)


											}}>
												<ItemCell index={index} selectedCell={selectedCell} change={changeSelection} selectedFilter={selected} />
											</section>
										);
									}
								})}
							</div>
						</div>
						{selectedCell !== null ? (
							<div className={s.infoDialog}>
								<ItemInfo
									id={state.warehouse[selected][selectedCell]!.id}
									img={state.warehouse[selected][selectedCell]!.img}
									name={state.warehouse[selected][selectedCell]!.name}
									weight={state.warehouse[selected][selectedCell]!.weight}
									fractionId={fractionId}
									selected={selected}
									selectedCell={selectedCell}
									change={changeSelection}
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
