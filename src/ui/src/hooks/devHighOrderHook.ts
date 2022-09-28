export const devHighOrderHook = <Hook extends (...args: any[]) => any>(
	useDevHook: Hook
): ((...args: Hook extends (...args: infer HookArguments) => void ? HookArguments : never) => ReturnType<Hook>) | void => {
	if (process.env.NODE_ENV !== 'development') return;

	return (...args) => {
		return useDevHook(...args);
	};
};
