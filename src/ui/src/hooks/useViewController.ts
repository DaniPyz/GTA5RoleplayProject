import { ViewControllerContext } from 'components/Router/Router';
import { useContext } from 'react';

export const useViewController = () => {
	const controller = useContext(ViewControllerContext);

	return controller;
};
