import { useKeyboard } from 'hooks';
import { client } from 'index';
import { FC } from 'react';
import { animated } from 'react-spring';
import AppList from './apps';
import style from './Phone.module.scss';
import { useMasterSpring } from './Phone.spring';
import { ReactComponent as PhoneSvg } from './vectors/phone.svg';

const Phone: FC = () => {
	const s = useMasterSpring();

	useKeyboard('h', () => {
		client.temp.awdadw();
		console.log('h is pressed');
	});

	return (
		<div className={style.phone}>
			{s.enter(
				(styles, v) =>
					v && (
						<animated.div style={styles}>
							<PhoneSvg className={style.phoneVector}></PhoneSvg>
						</animated.div>
					)
			)}
		</div>
	);
};

export default Phone;
