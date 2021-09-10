//#region Global Imports
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

/**
 * @interface IDecorated
 */
 export interface IDecorated {
	new(...args: Array<any>): any; (...args: Array<any>): any; (...args: Array<any>): (classInstance: any) => any;
}

/**
 * @interface IAnnotated<T>
 */
export interface IAnnotated<T> {
	(obj: T): any;
	new(obj: T): T;
}
