declare global {
	type ArrayToUnion<T extends any[]> = T extends (infer Element)[] ? Element : never;

	interface PlayerServer extends PlayerMp {}
}

export {};
