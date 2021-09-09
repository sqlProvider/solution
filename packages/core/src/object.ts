/**
 * @interface IObject<Value>
 */

export interface IObject<Value = any> {
	[key: string]: Value;
}
