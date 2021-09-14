//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { DecoratorProcessor, IProcessorParams } from '@solution/core/src/decorator/processor';
import { InjectionScopeMetadataKey } from '@solution/core/src/di/metadata/scope/key';
//#endregion Local Imports

//#region Definations
//#endregion Definations

export class ProcessorFn extends DecoratorProcessor {
	public do({ targetClass, annotation, descriptor }: IProcessorParams<string>): any {
		const scopes: Array<string> = Reflect.getOwnMetadata(InjectionScopeMetadataKey, targetClass) || [];

		scopes[descriptor] = annotation;

		Reflect.defineMetadata(InjectionScopeMetadataKey, scopes, targetClass);
	}
}
