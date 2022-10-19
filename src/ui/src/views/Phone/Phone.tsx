import { FC } from 'react';
import { animated } from 'react-spring';
import AppList from './apps';
import style from './Phone.module.scss';
import { useMasterSpring } from './Phone.spring';
import { ReactComponent as PhoneSvg } from './vectors/phone.svg';

const Phone: FC = () => {
	const s = useMasterSpring();

	return (
		<div className={style.phone}>
			{s.enter((styles, v) => (
				v && (
					<animated.div style={styles}>
						<PhoneSvg className={style.phoneVector}></PhoneSvg>
					</animated.div>
				)
			))}
		</div>
	);
};

export default Phone;
