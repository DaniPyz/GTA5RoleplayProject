import { useAppSelector } from 'hooks';
import useMoment from 'hooks/useMoment';
import { FC } from 'react';
import { animated } from 'react-spring';
import AppList from './apps';
import style from './Phone.module.scss';
import { useMasterSpring } from './Phone.spring';
import { ReactComponent as NavSvg } from './vectors/nav.svg';
import { ReactComponent as NetSvg } from './vectors/net.svg';
import { ReactComponent as BatterySvg } from './vectors/battery.svg';
import { ReactComponent as PhoneSvg } from './vectors/phone.svg';

const Phone: FC = () => {
	const s = useMasterSpring();
	const phone = useAppSelector((state) => state.phoneState);
	const moment = useMoment({ update: 'm' });
	const OpenedApp = AppList[phone.app];

	return (
		<div className={style.phone}>
			{s.enter(
				(styles, v) =>
					v && (
						<animated.div style={styles}>
							<div className={style.app}>
								<OpenedApp />
							</div>
							<div className={style.overlay}>
								<div className={style.time}>{moment.format('HH:mm')}</div>
								<div className={style.other}>
									<NetSvg />
									<NavSvg />
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
