//#region Global Imports
import { DecoratorFactory, DecoratorProcessor, IAnnotated, IProcessorParams, Noop, Type } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

//#region Definations

//#endregion Definations

describe('@solution/core/decorator/factory ClassDecorator Usages', () => {
	it('DecoratorFactory: Usage of ProcessorFn', () => {
		class ProcessorFn extends DecoratorProcessor {
			public do({ targetClass }: IProcessorParams): any {
				expect(targetClass).toEqual(DecoratedClass);
			}
		}

		const Decorator = DecoratorFactory(
			DecoratorProcessor.Combine(
				new ProcessorFn()
			)
		);

		@Decorator()
		class DecoratedClass { }
	});

	it('DecoratorFactory: Usage of ProcessorFn with Annotation', () => {
		interface IDecoratorAnnotation {
			foo: string;
			bar: number;
		}

		const decoratorAnnotation: IDecoratorAnnotation = {
			bar: 1,
			foo: 'bar'
		};

		class ProcessorFn extends DecoratorProcessor {
			public do({ targetClass, annotation: { bar, foo } }: IProcessorParams<IDecoratorAnnotation>): any {
				expect(targetClass).toEqual(DecoratedClass);
				expect(bar).toBe(decoratorAnnotation.bar);
				expect(foo).toBe(decoratorAnnotation.foo);
			}
		}

		const Decorator: IAnnotated<IDecoratorAnnotation> = DecoratorFactory(
			DecoratorProcessor.Combine(
				new ProcessorFn()
			)
		);

		@Decorator(decoratorAnnotation)
		class DecoratedClass { }
	});

	it('DecoratorFactory: Can ProcessorFn modify Target', () => {
		interface IDecoratorAnnotation {
			key: string;
			value: number;
		}

		const decoratorAnnotation: IDecoratorAnnotation = {
			key: 'ProcessorFnWithAnnotation',
			value: 1000
		};

		class ProcessorFn extends DecoratorProcessor {
			public do({ targetClass, annotation }: IProcessorParams<IDecoratorAnnotation>): any {
				targetClass.prototype[annotation.key] = annotation.value;
			}
		}

		const Decorator: IAnnotated<IDecoratorAnnotation> = DecoratorFactory(
			DecoratorProcessor.Combine(
				new ProcessorFn()
			)
		);

		@Decorator(decoratorAnnotation)
		class DecoratedClass { }

		const decoratedClass = new DecoratedClass();

		expect(decoratedClass[decoratorAnnotation.key]).toBe(decoratorAnnotation.value);
	});

	it('DecoratorFactory: Usage of RootAccess', () => {
		class RootAccess extends DecoratorProcessor {
			public do({ targetClass }: IProcessorParams): Function {
				expect(targetClass).toEqual(DecoratedClass);

				// Changing target class
				return Noop;
			}
		}

		const Decorator = DecoratorFactory(
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

	it('DecoratorFactory: Usage of RootAccess with Extend', () => {
		class RootAccess extends DecoratorProcessor {
			public do({ targetClass }: IProcessorParams): Function {
				expect(targetClass).toEqual(DecoratedClass);

				// Extending target class
				return class extends (targetClass as any) {
					public world(): string {
						return `world`;
					}
				};
			}
		}

		const Decorator = DecoratorFactory(
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

	it('DecoratorFactory: Usage of RootAccess with Wrapper', () => {
		interface IDecoratorAnnotation {
			extra: string;
		}
		class RootAccess extends DecoratorProcessor {
			public do({ targetClass, annotation: { extra } }: IProcessorParams<IDecoratorAnnotation>): Function {
				expect(targetClass).toEqual(DecoratedClass);
				// Wrapping target class
				// tslint:disable-next-line: only-arrow-functions
				function ClassWrapper(...args: Array<any>): typeof targetClass {
					return new (targetClass as any)(...args, extra);
				}

				ClassWrapper.prototype = targetClass.prototype;

				return ClassWrapper;
			}
		}

		const Decorator: IAnnotated<IDecoratorAnnotation> = DecoratorFactory(
			undefined,
			DecoratorProcessor.RootAccess(
				new RootAccess()
			)
		);

		@Decorator({
			extra: 'hello world'
		})
		class DecoratedClass {
			constructor(extra?: string) {
				expect(extra).toBe('hello world');
			}

			public hello(): string {
				return 'hello';
			}
		}

		const decoratedClass: any = new DecoratedClass();

		expect(decoratedClass instanceof DecoratedClass).toBeTrue();
		expect(Type.IsFunction(decoratedClass.hello)).toBeTrue();
		expect(decoratedClass.hello()).toBe('hello');
	});
});
