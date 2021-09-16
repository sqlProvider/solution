//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { DecoratorProcessor, IProcessorParams } from '@solution/core/src/decorator';
import { InjectionScopeMetadataKey } from '@solution/core/src/di/metadata/scope/key';
import { InjectionScope } from '@solution/core/src/di/metadata/scope/scope';
import { RootInjectionToken } from '@solution/core/src/di/metadata/token';
import { InjectionProvider } from '@solution/core/src/di/provider';
import { InjectionToken } from '@solution/core/src/di/token';
import { Type } from '@solution/core/src/type';
//#endregion Local Imports

/**
 * @class RootAccess
 */
export class RootAccess extends DecoratorProcessor {
	public do({ targetClass }: IProcessorParams): any {
		const injectionList: Array<any> = Reflect.getMetadata('design:paramtypes', targetClass) || [];
		const scopes: Array<InjectionScope> = Reflect.getOwnMetadata(InjectionScopeMetadataKey, targetClass) || [];

		// tslint:disable-next-line: only-arrow-functions
		const InjectionRootAccessWrapper = function (...args: Array<any>): typeof targetClass {
			const customArgs: Array<any> = [];
			const possibleInjectionTokens: Array<InjectionToken> = args[args.length - 1];
			const isValidChain = Type.IsArray(possibleInjectionTokens) && possibleInjectionTokens.filter(token => token instanceof InjectionToken);
			const injectionTokens = isValidChain ? possibleInjectionTokens : [RootInjectionToken];

			injectionList.forEach((injection, index) => {
				const instance = InjectionProvider.TryInject({
					injection,
					injectionTokens: [...injectionTokens],
					parent: targetClass,
					scope: scopes[index]
				});
				customArgs[index] = Type.IsNull(instance) ? args[index] : instance;
			});

			return new (targetClass as any)(...customArgs, injectionTokens);
		};

		InjectionRootAccessWrapper.prototype = targetClass.prototype;

		return InjectionRootAccessWrapper;
	}
}
