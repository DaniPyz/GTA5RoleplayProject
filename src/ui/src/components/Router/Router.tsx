import { createContext, FC, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'hooks';
import style from './Router.module.scss';
import { Hud } from 'index';

interface IRouterProps {
	views: { [key: string]: FC<IViewControllerProps> };
	hudList: { [key: string]: FC };
}

interface IViewControllerContext {
	render: boolean;
	isInUnmountQueue: boolean; // Запрос на удаление компонента;
	fetchUnmount: () => void; // Удалить компонент, если isInUnmountQueue = true;
	delayUnmount: () => void; // Задержать рендер компонента;
}

export interface IViewControllerProps {
	component: IViewControllerContext;
}

export const ViewControllerContext = createContext<IViewControllerContext>(null as any);

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

		const injectedProps: IViewControllerContext = {
			render: props.render,
			isInUnmountQueue,
			delayUnmount() {
				setIsInUnmountQueue(true);
			},
			fetchUnmount() {
				setRender(false);
				setIsInUnmountQueue(false);
			}
		};

		if (!render && !isInUnmountQueue) return null;

		return (
			<ViewControllerContext.Provider value={injectedProps}>
				<Component component={injectedProps} />
			</ViewControllerContext.Provider>
		);
	};
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
		<div className={style.isolatedViewport}>
			{HudList.map((Hud, index) => (
				<Hud key={index} />
			))}

			{views.map(([name, View]) => (
				<View key={name} render={name === state.view} />
			))}
		</div>
	);
};

export default Router;
