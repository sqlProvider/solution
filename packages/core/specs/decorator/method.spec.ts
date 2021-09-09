//#region Global Imports
import { noop, DecoratorProcessor, IProcessorParams, MethodDecorator } from '@solution/core';
import { IAnnotatedMethod } from '@solution/core/src/decorator/method';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/decorator/parameter', () => {
	it('empty decorator should be creatable', () => {
		const Decorator = MethodDecorator.Create();

		@Decorator()
		class DecoratedClass {
			constructor(protected param: MethodDecorator) { }
		}

		const types = Reflect.getMetadata('design:paramtypes', DecoratedClass);

		expect(types[0]).toEqual(MethodDecorator);
	});

	it('MethodDecorator.Create: invalid params check', () => {
		let Decorator: any;
		try {
			// Those params must be a function for run
			Decorator = (MethodDecorator as any).Create({}, []);

			@Decorator()
			class DecoratedClass { }

			noop(DecoratedClass);
		} catch (error) {
			expect(error).toBeFalsy();
		}

		try {
			// For combine processor this usage is valid because method get rest parameter
			Decorator = MethodDecorator.Create(
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
			Decorator = MethodDecorator.Create(
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

	it('MethodDecorator.Create: usage of ProcessorFn', () => {
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

		const Decorator: IAnnotatedMethod<IAnnotations> = MethodDecorator.Create(
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
