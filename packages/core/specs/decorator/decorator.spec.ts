//#region Global Imports
import { ClassDecorator, DecoratorProcessor, IAnnotatedClass, Type } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

//#region Definations
class Noop {
	public hello(): string {
		return 'hello';
	}
}
//#endregion Definations

describe('@solution/core/decorator', () => {
	interface IDecoratorAnnotations {
		foo: string;
		bar: number;
	}

	const decoratorAnnotations: IDecoratorAnnotations = {
		bar: 1,
		foo: 'bar'
	};

	class DecoratorProcessorFn extends DecoratorProcessor<IDecoratorAnnotations> {
		public do(target: Function, annotations: IDecoratorAnnotations): void {
			it('is processor parameters correct', () => {
				expect(Type.IsFunction(target)).toBeTrue();

				expect(annotations.bar).toBe(decoratorAnnotations.bar);
				expect(annotations.foo).toBe(decoratorAnnotations.foo);
			});
		}
	}

	class DecoratorRootAccessFn extends DecoratorProcessor<IDecoratorAnnotations> {
		public do(_target: Function, annotations: IDecoratorAnnotations): Function {
			it('is root access parameters correct', () => {
				expect(annotations.bar).toBe(decoratorAnnotations.bar);
				expect(annotations.foo).toBe(decoratorAnnotations.foo);
			});

			return Noop;
		}
	}

	const Decorator: IAnnotatedClass<IDecoratorAnnotations> = ClassDecorator.Create(
		'Decorator',
		DecoratorProcessor.Combine(
			new DecoratorProcessorFn()
		),
		DecoratorProcessor.RootAccess(
			new DecoratorRootAccessFn()
		)
	);

	@Decorator(decoratorAnnotations)
	class DecoratedClass {
		public message(): string {
			return 'message';
		}
	}

	const decoratedClass = new DecoratedClass();

	it('is root access worked', () => {
		expect(decoratedClass instanceof Noop).toBeTrue();

		// DecoratedClass changed but its signature still
		expect(decoratedClass instanceof DecoratedClass).toBeTrue();

		expect(Type.IsUndefined((decoratedClass as any).message)).toBeTrue();
		expect(Type.IsFunction((decoratedClass as any).hello)).toBeTrue();
		expect((decoratedClass as any).hello()).toBe('hello');
	});
});

describe('@solution/core/decorator Root Access Usage 2', () => {
	class DecoratorRootAccessFn extends DecoratorProcessor {
		public do(Target: any): Function {
			return class extends Target {
				public hello(): string {
					return 'hello';
				}
			};
		}
	}

	const Decorator = ClassDecorator.Create(
		'Decorator',
		undefined,
		DecoratorProcessor.RootAccess(
			new DecoratorRootAccessFn()
		)
	);

	@Decorator()
	class DecoratedClass {
		public message(): string {
			return 'message';
		}
	}

	const decoratedClass = new DecoratedClass();

	it('is root access worked', () => {
		expect(decoratedClass instanceof DecoratedClass).toBeTrue();

		expect(Type.IsFunction((decoratedClass as any).message)).toBeTrue();
		expect((decoratedClass as any).message()).toBe('message');
		expect(Type.IsFunction((decoratedClass as any).hello)).toBeTrue();
		expect((decoratedClass as any).hello()).toBe('hello');
	});
});
