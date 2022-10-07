import { useViewController } from 'hooks';
import { useEffect } from 'react';
import { useTransition } from 'react-spring';

const useMasterSpring = () => {
	const { delayUnmount, fetchUnmount, isInUnmountQueue, render } = useViewController();

	const hideTransition = useTransition(render, {
		from: { opacity: 0 },
		leave: { opacity: 0 },
		enter: { opacity: 1 }
	});

	const leftBlockTransition = useTransition(render, {
		from: { x: '-55%', opacity: 0 },
		leave: { x: '-55%', opacity: 0 },
		enter: { x: '0', opacity: 1 }
	});

	const rightBlockTransition = useTransition(render, {
		from: { x: '55%', opacity: 0 },
		leave: { x: '55%', opacity: 0 },
		enter: { x: '0', opacity: 1 },
		onRest: () => {
			if (!render && isInUnmountQueue) {
				fetchUnmount();
			}
		}
	});

	useEffect(() => {
		delayUnmount();
	}, [delayUnmount, render]);

	return { leftBlockTransition, rightBlockTransition, hideTransition };
};

export default useMasterSpring;
