//#region Global Imports
import { noop, Noop, Type } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/util/noop', () => {
	it('noop Method', () => {
		expect(Type.IsFunction(noop)).toBeTrue();
		expect(noop()).toEqual([]);
	});

	it('Noop Class', () => {
		const noopClass = new Noop();

		expect(noopClass instanceof Noop).toBeTrue();
	});
});
