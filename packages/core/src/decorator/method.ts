//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { IDecoratorProcessorFn, IDecoratorRootAccessFn } from '@solution/core/src/decorator/processor';
import { Type } from '@solution/core/src/type';
//#endregion Local Imports

/**
 * @interface IDecoratedClass
 */
export interface IDecoratedClass {
	new(...args: Array<any>): any; (...args: Array<any>): any; (...args: Array<any>): (classInstance: any) => any;
}

/**
 * @interface IAnnotatedMethod<T>
 */
 export interface IAnnotatedMethod<T> {
	(obj: T): any;
	new(obj: T): T;
}

/**
 * @class MethodDecorator
 */
export class MethodDecorator {
	public static Create(
		processorFn?: IDecoratorProcessorFn,
		rootAccessFn?: IDecoratorRootAccessFn
	): IDecoratedClass {

		function DecoratorFactory(this: any, annotations: any): (targetClass: Function, key: string, descriptor: PropertyDescriptor) => any {
			// tslint:disable-next-line: only-arrow-functions
			return function MethodDecoratorFactory(targetClass: Function, key: string, descriptor: PropertyDescriptor): Function {
				const params = { targetClass, annotations, key, descriptor };

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

		return DecoratorFactory as any;
	}
}
