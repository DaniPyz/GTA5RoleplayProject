import { useAppSelector } from 'hooks';
import { useTransition } from 'react-spring';

export const useMasterSpring = () => {
	const phone = useAppSelector((state) => state.phoneState);
	const dialogOpen = useTransition(phone.isDialogOpened, {
		from: { x: '100%' },
		leave: { x: '100%' },
		enter: { x: '0%' }
	});

	return {
		dialogOpen
	};
};
