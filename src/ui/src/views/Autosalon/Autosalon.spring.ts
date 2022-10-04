import { useViewController } from 'hooks';
import { useEffect } from 'react';
import { useTransition } from 'react-spring';

const useMasterSpring = () => {
	const controller = useViewController();

	const hideTransition = useTransition(controller.render, {
		from: { opacity: 0 },
		leave: { opacity: 0 },
		enter: { opacity: 1 }
	});

	const leftBlockTransition = useTransition(controller.render, {
		from: { x: '-55%', opacity: 0 },
		leave: { x: '-55%', opacity: 0 },
		enter: { x: '0', opacity: 1 }
	});

	const rightBlockTransition = useTransition(controller.render, {
		from: { x: '55%', opacity: 0 },
		leave: { x: '55%', opacity: 0 },
		enter: { x: '0', opacity: 1 },
		onRest: () => {
			if (!controller.render && controller.isInUnmountQueue) {
				controller.fetchUnmount();
			}
		}
	});

	useEffect(() => {
		controller.delayUnmount();
	}, [controller, controller.render]);

	return { leftBlockTransition, rightBlockTransition, hideTransition };
};

export default useMasterSpring;
