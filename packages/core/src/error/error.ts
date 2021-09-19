//#region Global Imports
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

/**
 * @class Error
 */
export class Error {
	constructor(errorObject: any, message: Function) {
		this.message = message(errorObject, errorObject);
		this.error = errorObject;

		throw this;
	}

	public message: string;
	public error: any;
}
