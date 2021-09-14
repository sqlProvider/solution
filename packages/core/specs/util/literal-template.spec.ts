//#region Global Imports
import { LiteralTemplate } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/util/literal-template', () => {
	it('Single use', () => {
		const template = LiteralTemplate`${0}!`;

		expect(template('hello world')).toBe('hello world!');
	});

	it('With parameter', () => {
		const template = LiteralTemplate`${0} ${'foo'}`;

		expect(template('hello world', { foo: '!' })).toBe('hello world !');
	});

	it('With just variables', () => {
		const template = LiteralTemplate`${'foo'} ${'bar'}`;

		expect(template({ bar: 'world', foo: 'hello' })).toBe('hello world');
		expect(template('not effected string', { bar: 'world', foo: 'hello' })).toBe('hello world');
	});
});
