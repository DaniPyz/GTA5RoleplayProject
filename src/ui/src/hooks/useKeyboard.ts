import keycode from 'keycode';
import { useEffect } from 'react';

type KeyTypes = keyof typeof keycode.codes;

// callback должен быть обернут в useCallback
export const useKeyboard = (keyName: KeyTypes | null, callback: (e: KeyboardEvent, key: KeyTypes) => void, type: 'keyup' | 'keydown' = 'keyup') => {
	useEffect(() => {
		function handler(e: KeyboardEvent, key = keycode(e)) {
			if (key === keyName || keyName === null) {
				callback(e, keycode(e) as KeyTypes);
			}
		}

		document.addEventListener(type, handler);
		return () => document.removeEventListener(type, handler);
	}, [keyName, callback, type]);
};
