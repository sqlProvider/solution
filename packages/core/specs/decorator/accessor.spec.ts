//#region Global Imports
import { noop, AccessorDecorator, DecoratorProcessor, IAnnotated, IProcessorParams } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/decorator/parameter', () => {
	it('empty decorator should be creatable', () => {
		const Decorator = AccessorDecorator.Create();

		@Decorator()
		class DecoratedClass {
			constructor(protected param: AccessorDecorator) { }
		}

		const types = Reflect.getMetadata('design:paramtypes', DecoratedClass);

		expect(types[0]).toEqual(AccessorDecorator);
	});

	it('AccessorDecorator.Create: invalid params check', () => {
		let Decorator: any;
		try {
			// Those params must be a function for run
			Decorator = (AccessorDecorator as any).Create({}, []);

			@Decorator()
			class DecoratedClass { }

			noop(DecoratedClass);
		} catch (error) {
			expect(error).toBeFalsy();
		}

		try {
			// For combine processor this usage is valid because method get rest parameter
			Decorator = AccessorDecorator.Create(
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
			Decorator = AccessorDecorator.Create(
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

	it('AccessorDecorator.Create: usage of ProcessorFn', () => {
		interface IAnnotations {
			extra: string;
		}

		class ProcessorFn extends DecoratorProcessor {
			public do({ targetClass, annotations, key, descriptor }: IProcessorParams<IAnnotations, PropertyDescriptor>): any {
				// Wrapping target method
				targetClass[key] = (...args: Array<any>) =>
					`${descriptor.value(...args, annotations.extra)} ${annotations.extra}`;
			}
		}

		const Decorator: IAnnotated<IAnnotations> = AccessorDecorator.Create(
			DecoratorProcessor.Combine(
				new ProcessorFn()
			)
			/*
				You can have Root Access on target.
				See class.spec.ts for usage of RootAccess
			*/
		);

		class Target {

			@Decorator({
				extra: 'world'
			})
			public hello(): string {
				return 'hello';
			}
		}

		const target = new Target();

		expect(target.hello()).toBe('hello world');
	});
});
