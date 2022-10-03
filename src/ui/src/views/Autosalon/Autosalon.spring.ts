import { useTransition } from 'react-spring';

interface IAutosalonSpring {
	isOpened: boolean;
}

const useMasterSpring = ({ isOpened }: IAutosalonSpring) => {
	const hideTransition = useTransition(isOpened, {
		from: { opacity: 0 },
		leave: { opacity: 0 },
		enter: { opacity: 1 }
	});

	const leftBlockTransition = useTransition(isOpened, {
		from: { x: '-55%', opacity: 0 },
		leave: { x: '-55%', opacity: 0 },
		enter: { x: '0', opacity: 1 }
	});

	const rightBlockTransition = useTransition(isOpened, {
		from: { x: '55%', opacity: 0 },
		leave: { x: '55%', opacity: 0 },
		enter: { x: '0', opacity: 1 }
	});

	return { leftBlockTransition, rightBlockTransition, hideTransition };
};

export default useMasterSpring;
