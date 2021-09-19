//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { Error, ErrorString } from '@solution/core/src/error';
//#endregion Local Imports

//#region Definations
//#endregion Definations

/**
 * @interface IProcessorParams
 */
export interface IProcessorParams<Annotation = any, Descriptor = any> {
	annotation: Annotation;
	descriptor: Descriptor;
	key: string | any;
	targetClass: Function;
}

/**
 * @type IDecoratorProcessorFn
 */
export type IDecoratorProcessorFn = (params: IProcessorParams) => any;

/**
 * @type IDecoratorRootAccessFn
 */
export type IDecoratorRootAccessFn = (params: IProcessorParams) => any;

/**
 * @function DecoratorProcessor
 */
export abstract class DecoratorProcessor {
	public static Combine(...processors: Array<DecoratorProcessor>): IDecoratorProcessorFn {
		return (params: IProcessorParams) => {
			processors.forEach(processor => {
				if (processor instanceof DecoratorProcessor) {
					return processor.do(params);
				}

				this.error();
			});
		};
	}

	public static RootAccess(processor: DecoratorProcessor): IDecoratorRootAccessFn {
		return (params: IProcessorParams) => {
			if (processor instanceof DecoratorProcessor) {
				return processor.do(params) || params.targetClass;
			}

			this.error();
		};
	}

	public abstract do(params: IProcessorParams): any;

	private static error(): void {
		throw new Error({ from: 'DecoratorProcessor' }, ErrorString.DecoratorProcessorInstance);
	}
}
