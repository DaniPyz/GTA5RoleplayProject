export const devHighOrderHook = <Hook extends (...args: any[]) => any>(
	useDevHook: Hook
): ((...args: Hook extends (...args: infer HookArguments) => void ? HookArguments : never) => ReturnType<Hook>) => {
	if (window.isRunAsBrowser) return () => ({} as any);

	return (...args) => {
		return useDevHook(...args);
	};
};
