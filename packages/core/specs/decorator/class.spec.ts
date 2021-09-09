//#region Global Imports
import { noop, ClassDecorator, DecoratorProcessor, IAnnotatedClass, IProcessorParams, Noop, Type } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

//#region Definations

//#endregion Definations

describe('@solution/core/decorator/class', () => {
	it('empty decorator should be creatable', () => {
		const Decorator = ClassDecorator.Create();

		@Decorator()
		class DecoratedClass {
			constructor(protected param: ClassDecorator) { }
		}

		const types = Reflect.getMetadata('design:paramtypes', DecoratedClass);

		expect(types[0]).toEqual(ClassDecorator);
	});

	it('ClassDecorator.Create: invalid params check', () => {
		let Decorator: any;
		try {
			// Those params must be a function for run
			Decorator = (ClassDecorator as any).Create({}, []);

			@Decorator()
			class DecoratedClass { }

			noop(DecoratedClass);
		} catch (error) {
			expect(error).toBeFalsy();
		}

		try {
			// For combine processor this usage is valid because method get rest parameter
			Decorator = ClassDecorator.Create(
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
			Decorator = ClassDecorator.Create(
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

	it('ClassDecorator.Create: usage of ProcessorFn', () => {
		class ProcessorFn extends DecoratorProcessor {
			public do({ targetClass }: IProcessorParams): any {
				expect(targetClass).toEqual(DecoratedClass);
			}
		}

		const Decorator = ClassDecorator.Create(
			DecoratorProcessor.Combine(
				new ProcessorFn()
			)
		);

		@Decorator()
		class DecoratedClass { }
	});

	it('ClassDecorator.Create: usage of ProcessorFn with Annotations', () => {
		interface IDecoratorAnnotations {
			foo: string;
			bar: number;
		}

		const decoratorAnnotations: IDecoratorAnnotations = {
			bar: 1,
			foo: 'bar'
		};

		class ProcessorFn extends DecoratorProcessor {
			public do({ targetClass, annotations: { bar, foo } }: IProcessorParams<IDecoratorAnnotations>): any {
				expect(targetClass).toEqual(DecoratedClass);
				expect(bar).toBe(decoratorAnnotations.bar);
				expect(foo).toBe(decoratorAnnotations.foo);
			}
		}

		const Decorator: IAnnotatedClass<IDecoratorAnnotations> = ClassDecorator.Create(
			DecoratorProcessor.Combine(
				new ProcessorFn()
			)
		);

		@Decorator(decoratorAnnotations)
		class DecoratedClass { }
	});

	it('ClassDecorator.Create: can ProcessorFn modify Target', () => {
		interface IDecoratorAnnotations {
			key: string;
			value: number;
		}

		const decoratorAnnotations: IDecoratorAnnotations = {
			key: 'ProcessorFnWithAnnotations',
			value: 1000
		};

		class ProcessorFn extends DecoratorProcessor {
			public do({ targetClass, annotations }: IProcessorParams<IDecoratorAnnotations>): any {
				targetClass.prototype[annotations.key] = annotations.value;
			}
		}

		const Decorator: IAnnotatedClass<IDecoratorAnnotations> = ClassDecorator.Create(
			DecoratorProcessor.Combine(
				new ProcessorFn()
			)
		);

		@Decorator(decoratorAnnotations)
		class DecoratedClass { }

		const decoratedClass = new DecoratedClass();

		expect(decoratedClass[decoratorAnnotations.key]).toBe(decoratorAnnotations.value);
	});

	it('ClassDecorator.Create: usage of RootAccess', () => {
		class RootAccess extends DecoratorProcessor {
			public do({ targetClass }: IProcessorParams): Function {
				expect(targetClass).toEqual(DecoratedClass);

				// Changing target class
				return Noop;
			}
		}

		const Decorator = ClassDecorator.Create(
			undefined,
			DecoratorProcessor.RootAccess(
				new RootAccess()
			)
		);

		@Decorator()
		class DecoratedClass {
			public hello(): string {
				return 'hello';
			}
		}

		const decoratedClass: any = new DecoratedClass();

		expect(decoratedClass instanceof Noop).toBeTrue();

		/**
		 * DecoratedClass changed but its signature stil in referance
		 * DecoratedClass prototype chain is deleted
		 */
		expect(decoratedClass instanceof DecoratedClass).toBeTrue();
		expect(Type.IsFunction(decoratedClass.hello)).toBeFalse();
	});

	it('ClassDecorator.Create: usage of RootAccess with Wrapper', () => {
		class RootAccess extends DecoratorProcessor {
			public do({ targetClass }: IProcessorParams): Function {
				expect(targetClass).toEqual(DecoratedClass);

				// Wrapping target class
				return class extends (targetClass as any) {
					public world(): string {
						return `world`;
					}
				};
			}
		}

		const Decorator = ClassDecorator.Create(
			undefined,
			DecoratorProcessor.RootAccess(
				new RootAccess()
			)
		);

		@Decorator()
		class DecoratedClass {
			public hello(): string {
				return 'hello';
			}
		}

		const decoratedClass: any = new DecoratedClass();

		expect(decoratedClass instanceof DecoratedClass).toBeTrue();
		expect(Type.IsFunction(decoratedClass.hello)).toBeTrue();
		expect(Type.IsFunction(decoratedClass.world)).toBeTrue();
		expect(`${decoratedClass.hello()} ${decoratedClass.world()}`).toBe('hello world');
	});
});
