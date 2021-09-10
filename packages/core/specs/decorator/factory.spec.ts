//#region Global Imports
import { noop, DecoratorFactory, DecoratorProcessor, Noop } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/decorator/factory', () => {
	it('Empty decorator should be creatable', () => {
		const Decorator = DecoratorFactory();
		@Decorator()
		class DecoratedClass {
			constructor(protected param: Noop) { }
		}

		const types = Reflect.getMetadata('design:paramtypes', DecoratedClass);

		expect(types[0]).toEqual(Noop);
	});

	it('Invalid params check', () => {
		let Decorator: any;
		try {
			// Those params must be a function for run
			Decorator = (DecoratorFactory as any)({}, []);

			@Decorator()
			class DecoratedClass { }

			noop(DecoratedClass);
		} catch (error) {
			expect(error).toBeFalsy();
		}

		try {
			// For combine processor this usage is valid because method get rest parameter
			Decorator = DecoratorFactory(
				(DecoratorProcessor as any).Combine()
			);

			@Decorator()
			class DecoratedClass { }

			noop(DecoratedClass);
		} catch (error) {
			expect(error).toBeFalsy();
		}

		try {
			// Processor must be filled when using
			Decorator = DecoratorFactory(
				(DecoratorProcessor as any).Combine([{}]),
				(DecoratorProcessor as any).RootAccess()
			);

			@Decorator()
			class DecoratedClass { }

			noop(DecoratedClass);
		} catch (error) {
			expect(error).toBeTruthy();
		}
	});
});
