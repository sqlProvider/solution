//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { IDecoratorProcessorFn, IDecoratorRootAccessFn, IProcessorParams } from '@solution/core/src/decorator/processor';
import { Type } from '@solution/core/src/type';
//#endregion Local Imports

/**
 * @interface IDecorated
 */
export interface IDecorated {
	new(...args: Array<any>): any;
	(...args: Array<any>): (...args: Array<any>) => any;
}

/**
 * @interface IAnnotated<T>
 */
export interface IAnnotated<T> {
	(annotation?: T): any;
	new(annotation?: T): any;
}

/**
 * @function DecoratorFactory
 */
// tslint:disable-next-line: only-arrow-functions
export function DecoratorFactory(processorFn?: IDecoratorProcessorFn, rootAccessFn?: IDecoratorRootAccessFn): IDecorated {
	// tslint:disable-next-line: only-arrow-functions
	function DecoratorFactoryCore(annotation: any): (...args: Array<any>) => any {
		// tslint:disable-next-line: only-arrow-functions
		return function Core(targetClass: Function, key?: string, descriptor?: any): any {
			const params: IProcessorParams = { targetClass, annotation, key, descriptor };

			if (Type.IsFunction(processorFn)) {
				processorFn(params);
			}

			if (Type.IsFunction(rootAccessFn)) {
				const changedTarget = rootAccessFn(params);
				targetClass = changedTarget || targetClass;
			}

			return targetClass;
		};
	}

	return DecoratorFactoryCore as any;
}
