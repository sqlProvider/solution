/**
 * @interface IDisposable<Target>
 */
export interface IDisposable<Target> {
	(): Target;
	dispose(): boolean;
}

/**
 * @interface IDispose
 */
 export interface IDispose {
	dispose(): void | Promise<any>;
}
