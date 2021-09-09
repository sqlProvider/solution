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
 * @interface IAnnotatedClass<T>
 */
export interface IAnnotatedClass<T> {
	(obj: T): any;
	new(obj: T): T;
}

/**
 * @class ClassDecorator
 */
export class ClassDecorator {
	public static Create(
		name: string,
		processorFn?: IDecoratorProcessorFn,
		rootAccessFn?: IDecoratorRootAccessFn
	): IDecoratedClass {

		function DecoratorFactory(this: any, annotations: any): (targetClass: Function) => any {
			// tslint:disable-next-line: only-arrow-functions
			return function ClassDecoratorFactory(targetClass: Function): Function {
				if (Type.IsFunction(processorFn)) {
					processorFn(targetClass, annotations);
				}

				if (Type.IsFunction(rootAccessFn)) {
					const changedTarget = rootAccessFn(targetClass, annotations);
					targetClass = changedTarget || targetClass;
				}

				return targetClass;
			};
		}

		DecoratorFactory.prototype.metadataName = name;
		(DecoratorFactory as any).annotationClassInstance = DecoratorFactory;

		return DecoratorFactory as any;
	}
}
