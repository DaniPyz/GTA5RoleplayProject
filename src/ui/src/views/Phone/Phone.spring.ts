import { useUnmount } from 'hooks';
import { useTransition } from 'react-spring';

export const useMasterSpring = () => {
	const { render, onRest } = useUnmount();

	const enter = useTransition(render, {
		from: { scale: 0, opacity: 0 },
		leave: { scale: 0, opacity: 0 },
		enter: { scale: 1, opacity: 1 },
		onRest
	});

	return { enter };
};
