/**
 * @interface IObject<V>
 */

export interface IObject<V = any> {
	[key: string]: V;
}
