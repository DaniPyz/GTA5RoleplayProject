import { IViewControllerProps } from 'components/Router/Router';
import { useEffect } from 'react';
import { useTransition } from 'react-spring';

const useMasterSpring = ({ component }: IViewControllerProps) => {
	const hideTransition = useTransition(component.render, {
		from: { opacity: 0 },
		leave: { opacity: 0 },
		enter: { opacity: 1 }
	});

	const leftBlockTransition = useTransition(component.render, {
		from: { x: '-55%', opacity: 0 },
		leave: { x: '-55%', opacity: 0 },
		enter: { x: '0', opacity: 1 }
	});

	const rightBlockTransition = useTransition(component.render, {
		from: { x: '55%', opacity: 0 },
		leave: { x: '55%', opacity: 0 },
		enter: { x: '0', opacity: 1 },
		onRest: () => {
			if (!component.render && component.isInUnmountQueue) {
				component.fetchUnmount();
			}
		}
	});

	useEffect(() => {
		component.delayUnmount();
	}, [component, component.render]);

	return { leftBlockTransition, rightBlockTransition, hideTransition };
};

export default useMasterSpring;
