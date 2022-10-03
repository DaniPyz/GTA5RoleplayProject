import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'hooks';
import style from './Router.module.scss';
import { Hud } from 'index';

interface IRouterProps {
	views: { [key: string]: FC<IViewControllerProps> };
	hudList: { [key: string]: FC };
}

interface IISolatedProps {
	children: ReactNode;
}

export interface IViewControllerProps {
	component: {
		render: boolean;
		isInUnmountQueue: boolean; // Запрос на удаление компонента;
		fetchUnmount: () => void; // Удалить компонент, если isInUnmountQueue = true;
		delayUnmount: () => void; // Задержать рендер компонента;
	};
}

export interface IDefaultViewProps {
	render: boolean;
}

const withViewController = (Component: FC<any>): FC<IDefaultViewProps> => {
	return (props) => {
		const [render, setRender] = useState(props.render);
		const [isInUnmountQueue, setIsInUnmountQueue] = useState(false);

		useEffect(() => {
			if (props.render) {
				setRender(true);
			} else {
				setRender(false);
			}
		}, [props.render]);

		const injectedProps: IViewControllerProps = {
			component: {
				render: props.render,
				isInUnmountQueue,
				delayUnmount() {
					setIsInUnmountQueue(true);
				},
				fetchUnmount() {
					setRender(false);
					setIsInUnmountQueue(false);
				}
			}
		};

		if (!render && !isInUnmountQueue) return null;

		return <Component {...injectedProps} />;
	};
};

const IsolatedComponent: FC<IISolatedProps> = ({ children }) => {
	return <div className={style.isolatedComponent}>{children}</div>;
};

const Router: FC<IRouterProps> = (props) => {
	const state = useAppSelector((state) => state.rootState);

	// let _View: FC<IComponentControllerProps> | null = null;
	let HudList: FC[] = [];

	const views: [string, FC<IDefaultViewProps>][] = useMemo(
		() => Object.entries(props.views).map(([name, View]) => [name, withViewController(View)]),
		[props.views]
	);

	// if (state.view) {
	// 	_View = props.views[state.view];
	// }

	const hudKeys = Object.keys(props.hudList) as Hud[];

	for (const key of hudKeys) {
		if (state.hudList.includes(key)) {
			HudList.push(props.hudList[key]);
		}
	}

	return (
		<>
			{HudList.map((Hud, index) => (
				<IsolatedComponent key={index}>
					<Hud />
				</IsolatedComponent>
			))}

			{views.map(([name, View]) => (
				<IsolatedComponent key={name}>
					<View render={name === state.view} />
				</IsolatedComponent>
			))}
		</>
	);
};

export default Router;
