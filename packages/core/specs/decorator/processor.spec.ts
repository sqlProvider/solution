//#region Global Imports
import { DecoratorProcessor, IProcessorParams, Noop, Type } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

//#region Definations
//#endregion Definations

describe('@solution/core/decorator/processor', () => {
	const processorHubConfig: IProcessorParams = {
		annotation: [],
		descriptor: null,
		key: '',
		targetClass: Noop
	};

	it('Processor must be extend DecoratorProcessor', () => {
		class ProcessorFn {
			public do(): any {
				// This method never been called
				expect(true).toBeFalse();
			}
		}

		try {
			const processorHub = DecoratorProcessor.Combine(
				new ProcessorFn()
			);

			processorHub(processorHubConfig);
		} catch (error) {
			expect(error).toBeTruthy();
		}
	});

	it('Usage of DecoratorProcessor.Combine', () => {
		class ProcessorFn extends DecoratorProcessor {
			public do({ targetClass }: IProcessorParams): any {
				targetClass.prototype['ProcessorFn'] = 'ProcessorFnValue';
			}
		}

		const processorHub = DecoratorProcessor.Combine(
			new ProcessorFn()
		);

		processorHub(processorHubConfig);

		const noop = new Noop();

		expect(noop['ProcessorFn']).toBe('ProcessorFnValue');
	});

	it('Usage of DecoratorProcessor.RootAccess', () => {
		class BlackHole {}
		class Sun {}

		class RootAccess extends DecoratorProcessor {
			public do({ targetClass }: IProcessorParams): Function {
				expect(targetClass).toEqual(Sun);

				// Changing target class
				return BlackHole;
			}
		}

		const processorHub = DecoratorProcessor.RootAccess(
			new RootAccess()
		);

		const processedTarget = processorHub({
			...processorHubConfig,
			targetClass: Sun
		});

		const sun: any = new processedTarget();

		expect(sun).toBeInstanceOf(BlackHole);
		expect(sun).toBeInstanceOf(Sun);
	});

	it('Usage of DecoratorProcessor.RootAccess with Wrapper', () => {
		class Target {
			public hello(): string {
				return 'hello';
			}
		}

		class RootAccess extends DecoratorProcessor {
			public do({ targetClass }: IProcessorParams): Function {
				expect(targetClass).toEqual(Target);

				// Wrapping target class
				return class extends (targetClass as  any) {
					public world(): string {
						return `world`;
					}
				};
			}
		}

		const processorHub = DecoratorProcessor.RootAccess(
			new RootAccess()
		);

		const processedTarget = processorHub({
			...processorHubConfig,
			targetClass: Target
		});

		const target: any = new processedTarget();

		expect(target instanceof Target).toBeTrue();
		expect(Type.IsFunction(target.hello)).toBeTrue();
		expect(Type.IsFunction(target.world)).toBeTrue();
		expect(`${target.hello()} ${target.world()}`).toBe('hello world');
	});
});
