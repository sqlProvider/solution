//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { IDecoratorProcessorFn, IDecoratorRootAccessFn, IProcessorParams } from '@solution/core/src/decorator/processor';
import { IDecorated } from '@solution/core/src/decorator/types';
import { Type } from '@solution/core/src/type';
//#endregion Local Imports

/**
 * @class ClassDecorator
 */
export class ClassDecorator {
	public static Create(
		processorFn?: IDecoratorProcessorFn,
		rootAccessFn?: IDecoratorRootAccessFn
	): IDecorated {

		function DecoratorFactory(this: any, annotations: any): (targetClass: Function) => any {
			// tslint:disable-next-line: only-arrow-functions
			return function ClassDecoratorFactory(targetClass: Function): Function {
				const params = { targetClass, annotations } as IProcessorParams;

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
