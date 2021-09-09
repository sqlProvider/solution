/**
 * @class Type
 *
 * for type checking
 */
 export class Type {
	/**
	 * Check undefined
	 * @param value: any
	 */
	public static IsUndefined(value: any): value is undefined {
		return value === undefined;
	}

	/**
	 * Check null
	 * @param value: any
	 */
	public static IsNull(value: any): value is null {
		return value === null;
	}

	/**
	 * Check object
	 * @param value: any
	 */
	public static IsObject<T = Object>(value: any): value is T {
		return value instanceof Object;
	}

	/**
	 * Check string
	 * @param value: any
	 */
	public static IsString(value: any): value is string {
		return typeof value === 'string';
	}

	/**
	 * Check array
	 * @param value: any
	 */
	public static IsArray(value: any): value is Array<any> {
		return Array.isArray(value);
	}

	/**
	 * Check boolean
	 * @param value: any
	 */
	public static IsBool(value: any): value is boolean {
		return typeof value === 'boolean';
	}

	/**
	 * Check number
	 * @param value: any
	 */
	public static IsNumber(value: any): value is number {
		return typeof value === 'number';
	}

	/**
	 * Check function
	 * @param value: any
	 */
	public static IsFunction(value: any): value is Function {
		return typeof value === 'function';
	}

	/**
	 * Check function
	 * @param value: any
	 */
	public static IsRegExp(value: any): value is RegExp {
		return value instanceof RegExp;
	}
}
