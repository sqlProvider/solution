//#region Global Imports
import { noop, Error } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/error', () => {
	it('Must be run catch', () => {
		try {
			noop(new Error({}, () => ''));

			expect(true).toBeFalse();
		} catch (error) {
			expect(error).toBeTruthy();
		}
	});
});
