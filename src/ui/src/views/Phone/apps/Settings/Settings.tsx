import { FC } from 'react';
import style from './Settings.module.scss';

const Settings: FC = () => {
	return (
		<div className={style.settings}>
			<div className={style.nav}>Настройки</div>
			<div className={style.main}>
				<div className={style.item}>
					<div>Рингтон</div>
					<div>Egor Kreed - Самая</div>
				</div>
				<div className={style.item}>
					<div>Режим в самолете</div>
					<div>on/off</div>
				</div>
				<div className={style.item}>
					<div>Фото обои</div>
					<div>Добавить</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;
