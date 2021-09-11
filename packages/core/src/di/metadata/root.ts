//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { DecoratorProcessor, IProcessorParams } from '@solution/core/src/decorator';
import { IInjectionAnnotation } from '@solution/core/src/di/metadata/annotation';
import { RootInjectionToken } from '@solution/core/src/di/metadata/token';
import { InjectionProvider } from '@solution/core/src/di/provider';
import { InjectionToken } from '@solution/core/src/di/token';
import { Type } from '@solution/core/src/type';
//#endregion Local Imports

/**
 * @class RootAccess
 */
export class RootAccess extends DecoratorProcessor {
	public do({ targetClass, annotation }: IProcessorParams<IInjectionAnnotation>): any {
		const injectionList: Array<any> = Reflect.getMetadata('design:paramtypes', targetClass) || [];

		// tslint:disable-next-line: only-arrow-functions
		const InjectionRootAccessWrapper = function (...args: Array<any>): typeof targetClass {
			const customArgs: Array<any> = [];
			const possibleInjectionTokens: Array<InjectionToken> = args[args.length - 1];
			const isValidChain = Type.IsArray(possibleInjectionTokens) && possibleInjectionTokens.filter(token => token instanceof InjectionToken);
			const injectionTokens = isValidChain ? possibleInjectionTokens : [RootInjectionToken];

			injectionList.forEach((injection, index) => {
				const instance = InjectionProvider.TryInject(targetClass, injection, [...injectionTokens], annotation?.provideIn);
				customArgs[index] = Type.IsNull(instance) ? args[index] : instance;
			});

			return new (targetClass as any)(...customArgs, injectionTokens);
		};

		InjectionRootAccessWrapper.prototype = targetClass.prototype;

		return InjectionRootAccessWrapper;
	}
}
