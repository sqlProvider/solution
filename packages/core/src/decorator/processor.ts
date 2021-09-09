//#region Local Imports
//#endregion Local Imports

/**
 * @type IDecoratorProcessorFn
 */
export type IDecoratorProcessorFn = (type: Function, annotations: any) => any;

/**
 * @type IDecoratorRootAccessFn
 */
export type IDecoratorRootAccessFn = (type: Function, annotations: any) => any;

/**
 * @function DecoratorProcessor
 */
export abstract class DecoratorProcessor<AnnotationType = any> {
	public static Combine(...processors: Array<DecoratorProcessor>): IDecoratorProcessorFn {
		return (target: Function, annotations: any) => {
			processors.forEach(processor => {
				if (processor && processor.do instanceof Function) {
					processor.do(target, annotations);
				}
			});
		};
	}

	public static RootAccess(processor: DecoratorProcessor): IDecoratorRootAccessFn {
		return (target: Function, annotations: any) => {
			if (processor && processor.do instanceof Function) {
				return processor.do(target, annotations);
			}

			return target;
		};
	}

	public abstract do(target: Function, annotations?: AnnotationType): any;
}
