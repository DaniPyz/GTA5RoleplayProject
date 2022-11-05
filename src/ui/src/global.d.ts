declare global {
	type ArrayToUnion<T extends any[]> = T extends (infer Element)[] ? Element : never;

	interface Window {
		isRunAsBrowser: boolean;
	}
}
declare module 'react' {
	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		_customdata?: any;
	}
}
export {};
