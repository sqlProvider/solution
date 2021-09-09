//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { ErrorString } from '@solution/core/src/error/string';
//#endregion Local Imports

/**
 * @class WrongInstance
 */
export class WrongInstance {
	constructor(private from: string, private valid: string) {
		throw new Error(this.message());
	}

	public message(): string {
		return ErrorString.WrongInstance({
			from: this.from,
			valid: this.valid
		});
	}
}
