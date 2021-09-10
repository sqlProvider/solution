//#region Global Imports
import { DecoratorProcessor, IAnnotated, IProcessorParams, MethodDecorator } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/decorator/factory AccessorDecorator Usages', () => {
	it('Usage of ProcessorFn', () => {
		interface IAnnotations {
			extra: string;
		}

		class ProcessorFn extends DecoratorProcessor {
			public do({ targetClass, annotations, key, descriptor }: IProcessorParams<IAnnotations, PropertyDescriptor>): any {
				// Descriptor values
				descriptor.configurable = true;
				descriptor.enumerable = true;
				descriptor.writable = true;

				// Wrapping target method
				targetClass[key] = (...args: Array<any>) =>
					`${descriptor.value(...args, annotations.extra)} ${annotations.extra}`;
			}
		}

		const Decorator: IAnnotated<IAnnotations> = MethodDecorator.Create(
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
