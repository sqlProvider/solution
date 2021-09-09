//#region Global Imports
import { DecoratorProcessor } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

//#region Definations
class Noop {}
class Boop {}
//#endregion Definations

describe('@solution/core/decorator/processor', () => {
	const CombineTestProcessorOneKey = '__CombineTestProcessorOne';
	const CombineTestProcessorOneValue = 'CombineTestProcessorOne';
	const CombineTestProcessorTwoKey = '__CombineTestProcessorTwo';
	const CombineTestProcessorTwoValue = 'CombineTestProcessorTwo';

	class CombineTestProcessorOne extends DecoratorProcessor {
		public do(target: Function): any {
			target.prototype[CombineTestProcessorOneKey] = CombineTestProcessorOneValue;
		}
	}

	class CombineTestProcessorTwo extends DecoratorProcessor {
		public do(target: Function): any {
			target.prototype[CombineTestProcessorTwoKey] = CombineTestProcessorTwoValue;
		}
	}

	class RootAccessTestProcessor extends DecoratorProcessor {
		public do(): any {
			return Boop;
		}
	}

	it('can processors modify TargetClass', () => {
		const processorHub = DecoratorProcessor.Combine(
			new CombineTestProcessorOne(),
			new CombineTestProcessorTwo()
		);

		processorHub(Noop, []);

		const noop = new Noop();

		expect(noop[CombineTestProcessorOneKey]).toBe(CombineTestProcessorOneValue);
		expect(noop[CombineTestProcessorTwoKey]).toBe(CombineTestProcessorTwoValue);
	});

	it('can root processor change TargetClass', () => {
		const processorHub = DecoratorProcessor.RootAccess(
			new RootAccessTestProcessor()
		);

		const changedClass = processorHub(Noop, []);

		const noop = new changedClass();

		expect(noop instanceof Boop).toBeTrue();
	});
});
