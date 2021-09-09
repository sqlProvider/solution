//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { LiteralTemplate } from '@solution/core/src/util/literal-template';
//#endregion Local Imports

/**
 * @enum ErrorString
 */
export const ErrorString = {
	WrongInstance: LiteralTemplate`[${'from'}]: Processors must be instance of [${'valid'}]`
};

Object.freeze(ErrorString);
