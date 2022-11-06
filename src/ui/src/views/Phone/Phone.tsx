import { useAppDispatch, useAppSelector, useKeyboard } from 'hooks';
import useMoment from 'hooks/useMoment';
import { FC, useCallback, useMemo } from 'react';
import { animated } from 'react-spring';
import AppList from './apps';
import style from './Phone.module.scss';
import { useMasterSpring } from './Phone.spring';
import { ReactComponent as NavSvg } from './vectors/nav.svg';
import { ReactComponent as NetSvg } from './vectors/net.svg';
import { ReactComponent as BatterySvg } from './vectors/battery.svg';
import { ReactComponent as PhoneSvg } from './vectors/phone.svg';
import { setView } from 'index';
import React from 'react';

const Phone: FC = () => {
	const s = useMasterSpring();
	const phone = useAppSelector((state) => state.phoneState);
	const moment = useMoment({ update: 'm' });
	const OpenedApp = useMemo(() => React.memo(AppList[phone.app]), [phone.app]);
	const dispatch = useAppDispatch();

	useKeyboard(
		'esc',
		useCallback(() => {
			setView(null);
		}, [])
	);

	return (
		<div className={style.phone}>
			{s.enter(
				(styles, v) =>
					v && (
						<animated.div style={styles}>
							<div className={style.app}>
								<OpenedApp />
								{phone.app !== 'Home' ? (
									<div className={style.bottomBar} onClick={() => dispatch({ type: 'PHONE_APP_SET', app: 'Home' })}>
										<div />
									</div>
								) : null}
							</div>
							<div className={style.overlay}>
								<div className={style.time}>{moment.format('HH:mm')}</div>
								<div className={style.other}>
									{!phone.airmode ? (
										<>
											<NetSvg />
											<NavSvg />
										</>
									) : null}

									<BatterySvg />
								</div>
							</div>

							<PhoneSvg className={style.phoneVector}></PhoneSvg>
						</animated.div>
					)
			)}
		</div>
	);
};

export default Phone;
