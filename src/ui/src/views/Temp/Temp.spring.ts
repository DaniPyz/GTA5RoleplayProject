import { useAppDispatch, useAppSelector } from 'hooks';
import { client } from 'index';

const useMasterSpring = () => {
	const dipatch = useAppDispatch();
	const state = useAppSelector((state) => state.rootState);
};
