//#region Global Imports
import { DecoratorFactory, DecoratorProcessor, IAnnotated, IProcessorParams } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/decorator/factory PropertyDecorator Usages', () => {
	it('Usage of ProcessorFn', () => {
		interface IAnnotations {
			extra: string;
		}

		class ProcessorFn extends DecoratorProcessor {
			public do({ targetClass, annotations: { extra }, key }: IProcessorParams<IAnnotations>): any {
				delete targetClass[key];
				let realValue: any;

				Object.defineProperty(targetClass, key, {
					get(): any {
						return `${realValue} ${extra}`;
					},
					set(value: any): void { realValue = value; }
				});
			}
		}

		const Decorator: IAnnotated<IAnnotations> = DecoratorFactory(
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
			public hello: string = 'hello';
		}

		const target = new Target();

		expect(target.hello).toBe('hello world');
	});
});
