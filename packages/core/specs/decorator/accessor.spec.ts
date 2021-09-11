//#region Global Imports
import { DecoratorFactory, DecoratorProcessor, IAnnotated, IProcessorParams } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/decorator/factory AccessorDecorator Usages', () => {
	it('Usage of ProcessorFn', () => {

		interface IAnnotation {
			extra: string;
		}

		class ProcessorFn extends DecoratorProcessor {
			public do({ targetClass, annotation, key, descriptor }: IProcessorParams<IAnnotation, PropertyDescriptor>): any {
				// Descriptor values
				descriptor.configurable = true;
				descriptor.enumerable = true;
				descriptor.writable = true;

				// Wrapping target method
				targetClass[key] = (...args: Array<any>) =>
					`${descriptor.value(...args, annotation.extra)} ${annotation.extra}`;
			}
		}

		const Decorator: IAnnotated<IAnnotation> = DecoratorFactory(
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
