import { useAppSelector } from 'hooks';
import { useTransition } from 'react-spring';

export const useMasterSpring = () => {
	const phone = useAppSelector((state) => state.phoneState);
	const addContact = useTransition(phone.telephone.isCreateContact, {
		from: { bottom: '-77vh' },
		leave: { bottom: '-77vh' },
		enter: { bottom: '-14vh' }
	});

	return {
		addContact
	};
};
