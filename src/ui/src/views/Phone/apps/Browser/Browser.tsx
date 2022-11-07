import { FC, useRef, useState } from 'react';
import style from './Browser.module.scss';
import { ReactComponent as ReloadSvg } from './vectors/reload.svg';

const Browser: FC = () => {
	const [address, setAddress] = useState('https://ru.m.wikipedia.org/');
	const ref = useRef<HTMLIFrameElement>(null);

	return (
		<div className={style.browser}>
			<div className={style.frame}>
				<iframe ref={ref} title="main" src={address} frameBorder="0"></iframe>
			</div>
			<div className={style.bottom}>
				<div className={style.search}>
					{address}
					<ReloadSvg
						onClick={() => {
							setAddress('');
							setTimeout(() => {
								setAddress(address);
							}, 500);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Browser;
