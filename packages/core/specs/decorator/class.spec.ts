//#region Global Imports
import { ClassDecorator } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

//#region Definations
class Noop {}
//#endregion Definations

describe('@solution/core/decorator/class', () => {
	const TestDecoratorName = 'TestDecorator';
	const ProcessorFnTestKey = '____processorFnTestKey';
	const ProcessorFnTestValue = 'ProcessorFnTest';

	const ProcessorFnDecorator = ClassDecorator.Create(
		TestDecoratorName,
		targetClass => {
			targetClass.prototype[ProcessorFnTestKey] = ProcessorFnTestValue;
		},
		undefined
	);

	const RootAccessDecorator = ClassDecorator.Create(
		TestDecoratorName,
		undefined,
		() => Noop
	);

	it('can it be created', () => {
		expect(ProcessorFnDecorator.name).toBe('DecoratorFactory');
		expect(RootAccessDecorator.name).toBe('DecoratorFactory');
	});

	@ProcessorFnDecorator()
	class ProcessorFnDecoratedClass {}

	@RootAccessDecorator()
	class RootAccessDecoratedClass {}

	it('is processorFn working', () => {
		const processorFnTestClass = new ProcessorFnDecoratedClass();

		expect((processorFnTestClass as any)[ProcessorFnTestKey]).toBe(ProcessorFnTestValue);
	});

	it('is processorFn working', () => {
		const rootFnTestClass = new RootAccessDecoratedClass();

		expect(rootFnTestClass instanceof Noop).toBeTrue();
	});
});
