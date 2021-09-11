//#region Global Imports
import { DecoratorFactory, DecoratorProcessor, IAnnotated, IObject, IProcessorParams, Type } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/decorator/factory ParameterDecorator Usages', () => {
	it('Usage of ProcessorFn', () => {
		const DefaultMetadataKey = Symbol('__DefaultMetadataKey');

		class DefaultProcessorFn extends DecoratorProcessor {
			public do({ targetClass, annotation, key, descriptor }: IProcessorParams<string>): any {
				const defaults: IObject<string> = Reflect.getOwnMetadata(DefaultMetadataKey, targetClass, key) || {};

				defaults[descriptor] = annotation;

				Reflect.defineMetadata(DefaultMetadataKey, defaults, targetClass, key);
			}
		}

		class FillProcessorFn extends DecoratorProcessor {
			public do({ targetClass, key, descriptor }: IProcessorParams<any, PropertyDescriptor>): any {
				const source = descriptor.value;

				targetClass[key] = (...args: Array<any>) => {
					const defaults: IObject<string> = Reflect.getOwnMetadata(DefaultMetadataKey, targetClass, key);

					Object.entries(defaults).forEach(([key, value]) => {
						const index = parseInt(key);
						if (Type.IsUndefined(args[index])) {
							args[index] = value;
						}
					});

					return source(...args);
				};
			}
		}

		const Default: IAnnotated<string> = DecoratorFactory(
			DecoratorProcessor.Combine(
				new DefaultProcessorFn()
			)
			/*
				You can have Root Access on target.
				See class.spec.ts for usage of RootAccess
			*/
		);

		const Fill = DecoratorFactory(
			DecoratorProcessor.Combine(
				new FillProcessorFn()
			)
		);

		class Target {
			@Fill()
			public hello(@Default('Solution') name: string): string {
				return `Hello ${name}`;
			}
		}

		const target = new Target();

		expect(target.hello('Karga')).toBe('Hello Karga');
		expect((target as any).hello()).toBe('Hello Solution');
	});
});
