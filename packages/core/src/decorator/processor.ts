//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { WrongInstance } from '@solution/core/src/error';
//#endregion Local Imports

//#region Definations
const ErrorString = 'DecoratorProcessor';
//#endregion Definations

/**
 * @interface IProcessorParams
 */
export interface IProcessorParams<Annotations = any, Descriptor = any> {
	annotations: Annotations;
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

				throw new WrongInstance(ErrorString, ErrorString);
			});
		};
	}

	public static RootAccess(processor: DecoratorProcessor): IDecoratorRootAccessFn {
		return (params: IProcessorParams) => {
			if (processor instanceof DecoratorProcessor) {
				return processor.do(params) || params.targetClass;
			}

			throw new WrongInstance(ErrorString, ErrorString);
		};
	}

	public abstract do(params: IProcessorParams): any;
}
