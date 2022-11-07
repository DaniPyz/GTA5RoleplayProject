import keycode from 'keycode';
import { useEffect } from 'react';
import { store } from 'store';

type KeyTypes = keyof typeof keycode.codes;
type Callback = (e: KeyboardEvent, key: KeyTypes) => void;

type Priority = 'hud' | 'stack' | 'root';

type CallbackData = {
	callback: Callback;
	keyName: KeyTypes;
	priority: Priority;
};

const callbacks: CallbackData[] = [];

// callback для Priority=stack должен быть обернут в useCallback
export const useKeyboard = (keyName: KeyTypes, callback: Callback, type: 'keyup' | 'keydown' = 'keyup', priority: Priority = 'stack') => {
	useEffect(() => {
		const callbackData = {
			callback,
			keyName,
			priority
		};
		callbacks.push(callbackData);

		function handler(e: KeyboardEvent, key = keycode(e)) {
			if (key === keyName || keyName === null) {
				if (priority === 'hud') {
					if (store.getState().rootState.view !== null) return;
				} else if (priority === 'stack') {
					const a = callbacks.filter((x) => x.keyName === keyName && (x.priority === 'stack' || x.priority === 'root'));
					const d = a.findIndex((x) => callbackData === x);
					if (d < a.length - 1 || a.find((x) => x.priority === 'root')) return;
				}

				callback(e, keycode(e) as KeyTypes);
			}
		}

		document.addEventListener(type, handler);
		return () => {
			callbacks.remove(callbackData);
			document.removeEventListener(type, handler);
		};
	}, [keyName, callback, type, priority]);
};
