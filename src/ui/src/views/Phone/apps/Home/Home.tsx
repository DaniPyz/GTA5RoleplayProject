import { useAppDispatch, useAppSelector } from 'hooks';
import { FC } from 'react';
import { AppList } from '../index';
import style from './Home.module.scss';
import { useMoment } from 'hooks';
import 'moment/locale/ru' 

import { ReactComponent as CallSvg } from '../../vectors/call.svg';
import { ReactComponent as ContactsSvg } from '../../vectors/contacts.svg';
import { ReactComponent as SettingsSvg } from '../../vectors/settings.svg';
import { ReactComponent as MessagesSvg } from '../../vectors/messages.svg';
import { ReactComponent as BrowserSvg } from '../../vectors/browser.svg';
import { ReactComponent as TaxiSvg } from '../../vectors/taxi.svg';

const wallpaperList = ['main.png'];

interface IAppWrapper {
	name: AppList;
	Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const Home: FC = () => {
	const phone = useAppSelector((state) => state.phoneState);
	const dispatch = useAppDispatch();
	const moment = useMoment({ update: 'm' });
	moment.locale('RU-ru');

	const background = require(`./wallpapers/${wallpaperList[phone.wallpaper]}`);

	const bottomsApps: IAppWrapper[] = [
		{
			name: 'Call',
			Icon: CallSvg
		},
		{
			name: 'Contacts',
			Icon: ContactsSvg
		},
		{
			name: 'Settings',
			Icon: SettingsSvg
		},
		{
			name: 'Messages',
			Icon: MessagesSvg
		}
	];

	const centerApps: IAppWrapper[] = [
		{
			name: 'Taxi',
			Icon: TaxiSvg
		},
		{
			name: 'Browser',
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
										onClick={() => dispatch({ type: 'PHONE_APP_SET', app: app.name })}
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
										onClick={() => dispatch({ type: 'PHONE_APP_SET', app: app.name })}
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
