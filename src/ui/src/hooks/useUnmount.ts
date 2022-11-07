import { useEffect } from 'react';
import { useViewController } from './useViewController';

export const useUnmount = () => {
	const { delayUnmount, fetchUnmount, render, isInUnmountQueue } = useViewController();

	useEffect(() => {
		delayUnmount();
	}, [delayUnmount, render]);

	return {
		onRest: () => {
			if (!render && isInUnmountQueue) {
				fetchUnmount();
			}
		},
		render
	};
};
