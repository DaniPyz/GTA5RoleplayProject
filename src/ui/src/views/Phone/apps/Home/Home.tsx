import { useAppDispatch, useAppSelector } from 'hooks';
import { FC } from 'react';
import { AppList } from '../index';
import style from './Home.module.scss';
import { useMoment } from 'hooks';

import { ReactComponent as CallSvg } from '../../vectors/call.svg';
import { ReactComponent as ContactsSvg } from '../../vectors/contacts.svg';
import { ReactComponent as SettingsSvg } from '../../vectors/settings.svg';
import { ReactComponent as MessagesSvg } from '../../vectors/messages.svg';
import { ReactComponent as BrowserSvg } from '../../vectors/browser.svg';
import { ReactComponent as TaxiSvg } from '../../vectors/taxi.svg';

const wallpaperList = ['main.png'];

interface IAppWrapper {
	name: string;
	app: AppList;
	Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const Home: FC = () => {
	const phone = useAppSelector((state) => state.phoneState);
	const dispatch = useAppDispatch();
	const moment = useMoment({ update: 'm' });

	const background = require(`./wallpapers/${wallpaperList[phone.wallpaper]}`);

	const bottomsApps: IAppWrapper[] = [
		{
			app: 'Telephone',
			Icon: CallSvg,
			name: 'Телефон'
		},
		{
			app: 'Telephone',
			name: 'Контакты',
			Icon: ContactsSvg
		},
		{
			app: 'Settings',
			name: 'Настройки',
			Icon: SettingsSvg
		},
		{
			app: 'Messages',
			name: 'Сообщения',
			Icon: MessagesSvg
		}
	];

	const centerApps: IAppWrapper[] = [
		{
			app: 'Taxi',
			name: 'Такси',
			Icon: TaxiSvg
		},
		{
			app: 'Browser',
			name: 'Браузер',
			Icon: BrowserSvg
		}
	];

	return (
		<div className={style.home}>
			<div className={style.background} style={{ backgroundImage: `url(${background})` }}>
				<div className={style.wrapper}>
					<div className={style.main}>
						<div className={style.layout}>
							<div className={style.time}>
								<div>{moment.format('HH:mm')}</div>
								<div>{moment.format('dddd, Do MMMM').capitalize()}</div>
							</div>
							<div className={style.centerAppBlock}>
								{centerApps.map((app) => (
									<div
										className={style.appContainer}
										key={app.name}
										onClick={() => {
											dispatch({ type: 'PHONE_APP_SET', app: app.app });
										}}
									>
										<app.Icon className={style.appIcon} />
									</div>
								))}
							</div>
							<div className={style.bottomAppBlock}>
								{bottomsApps.map((app) => (
									<div
										className={style.appContainer}
										key={app.name}
										onClick={() => {
											if (app.app === 'Telephone') {
												if (app.name === 'Телефон') {
													dispatch({ type: 'PHONE_TELEPHONE_PAGE_SET', page: 'call' });
												} else {
													dispatch({ type: 'PHONE_TELEPHONE_PAGE_SET', page: 'contacts' });
												}
											}
											dispatch({ type: 'PHONE_APP_SET', app: app.app });
										}}
									>
										<app.Icon className={style.appIcon} />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
