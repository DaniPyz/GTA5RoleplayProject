import { FC, useCallback, useEffect, useState } from 'react';
import { useAppSelector, useKeyboard } from 'hooks';

import ItemCell from '../../components/ItemCell/ItemCell';
import { ItemInfo } from 'components';
import { animated } from 'react-spring';
import s from './Locker.module.scss';
import { setView } from 'index';
import useMasterSpring from './Locker.spring';

const Locker: FC = () => {
	const state = useAppSelector((state) => state.lockerState);

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
									Шкафчик
									<span>Организации</span>
								</h1>
							</div>
							<div className={s.category}>

							</div>

							<div className={s.cells}
							>
								{Array.from({ length: 72 }, (_, index: number) => {

									if (state.locker && state.locker && state.locker[index]) {
										// console.log(selected, index, selectedCell, state.warehouse[index]!.img)

										return (
											<section key={index} onClick={() => changeSelection(index)}>
												<ItemCell
													index={index}
													change={changeSelection}
													selectedCell={selectedCell}
													img={state.locker[index]!.img}
													count={state.locker[index]!.count}
													selectedFilter={selected}
													isLocker={true}
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
									id={state.locker[selectedCell]!.id}
									img={state.locker[selectedCell]!.img}
									name={state.locker[selectedCell]!.name}
									weight={state.locker[selectedCell]!.weight}
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

export default Locker;
