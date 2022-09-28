import { FC, ReactNode } from 'react';
import { useAppSelector } from 'hooks';
import style from './Router.module.scss';
import { Hud } from 'index';

interface IRouterProps {
	views: { [key: string]: FC };
	hudList: { [key: string]: FC };
}

interface IISolatedProps {
	children: ReactNode;
}

const IsolatedComponent: FC<IISolatedProps> = ({ children }) => {
	return <div className={style.isolatedComponent}>{children}</div>;
};

const Router: FC<IRouterProps> = (props) => {
	const state = useAppSelector((state) => state.rootState);

	let View: FC | null = null;
	let HudList: FC[] = [];

	if (state.view) {
		View = props.views[state.view];
	}

	const hudKeys = Object.keys(props.hudList) as Hud[];

	for (const key of hudKeys) {
		if (state.hudList.includes(key)) {
			HudList.push(props.hudList[key]);
		}
	}

	return (
		<>
			{HudList.map((Hud) => (
				<IsolatedComponent>
					<Hud />
				</IsolatedComponent>
			))}

			{View && (
				<IsolatedComponent>
					<View />
				</IsolatedComponent>
			)}
		</>
	);
};

export default Router;
