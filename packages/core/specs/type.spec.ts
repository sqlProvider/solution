//#region Global Imports
import { Type } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

//#region Definations
const Types = [
	undefined,
	null,
	'',
	[],
	true,
	0,
	() => true,
	/\s/g
];

const TypeMethods = [
	'IsUndefined',
	'IsNull',
	'IsString',
	'IsArray',
	'IsBool',
	'IsNumber',
	'IsFunction',
	'IsRegExp'
];
//#endregion Definations

describe('@solution/core/type', () => {
	TypeMethods.forEach((method, methodIndex) => {
		it(`${method} Method`, () => {
			Types.forEach((type, typeIndex) => {
				expect(Type[method](type)).toBe(methodIndex === typeIndex);
			});
		});
	});

	it('IsObject Method', () => {
		expect(Type.IsObject(undefined)).toBeFalse();
		expect(Type.IsObject(null)).toBeFalse();
		expect(Type.IsObject('')).toBeFalse();
		expect(Type.IsObject(true)).toBeFalse();
		expect(Type.IsObject(0)).toBeFalse();
		expect(Type.IsObject([])).toBeTrue();
		expect(Type.IsObject(() => true)).toBeTrue();
		expect(Type.IsObject(/\s/g)).toBeTrue();
		expect(Type.IsObject({})).toBeTrue();
	});
});
