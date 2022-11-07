import { useAppDispatch, useAppSelector } from 'hooks';
import { FC } from 'react';
import style from './Settings.module.scss';
import cls from 'classnames';
import { ReactComponent as MusicSvg } from './vectors/music.svg';
import { ReactComponent as AddSvg } from './vectors/add.svg';
import { ReactComponent as CheckedSvg } from './vectors/check.svg';

export const soundList = [
	{
		name: 'Егор Крид - Самая',
		src: ''
	},
	{
		name: 'Стандартный',
		src: ''
	}
];

export const wallpaperList = [
	{
		src: require('../Home/wallpapers/main.png')
	},
	{
		src: require('../Home/wallpapers/main.png')
	}
];

const Settings: FC = () => {
	const dispatch = useAppDispatch();
	const phone = useAppSelector((state) => state.phoneState);

	const switchAirMode = () => dispatch({ type: 'PHONE_AIRMODE_SET', value: !phone.airmode });

	return (
		<div className={style.settings}>
			<div className={style.nav}>Настройки</div>
			<div className={style.main}>
				<div className={style.item}>
					<div>Рингтон</div>
					<div className={style.ringtone}>
						<MusicSvg />
						<div className={style.ringtoneItem} onClick={() => dispatch({ type: 'PHONE_SOUND_SET', value: phone.sound + 1 })}>
							{soundList[phone.sound].name}
						</div>
					</div>
				</div>
				<div className={style.item}>
					<div>Режим в самолете</div>
					<div className={cls({ [style.airMode]: true, [style.active]: !phone.airmode })} onClick={switchAirMode}>
						<div className={style.airmodeButton} />
					</div>
				</div>
				<div className={style.item}>
					<div>Фото обои</div>
					<div className={style.add}>
						Добавить <AddSvg />
					</div>
				</div>
				<div className={style.wallpapers}>
					{wallpaperList.map((wallpaper, index) => (
						<div key={index} className={style.wrapper} onClick={() => dispatch({ type: 'PHONE_WALLPAPER_SET', wallpaper: index })}>
							<div className={cls({ [style.check]: true, [style.checked]: index === phone.wallpaper })}>
								{index === phone.wallpaper ? <CheckedSvg /> : null}
							</div>
							<img className={style.image} src={wallpaper.src} alt=""></img>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Settings;
