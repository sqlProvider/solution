//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { DecoratorFactory, DecoratorProcessor, IAnnotated } from '@solution/core/src/decorator';
import { ProcessorFn } from '@solution/core/src/di/metadata/scope/processor';
import { InjectionScope } from '@solution/core/src/di/metadata/scope/scope';
//#endregion Local Imports

export const Scope: IAnnotated<InjectionScope> = DecoratorFactory(
	DecoratorProcessor.Combine(
		new ProcessorFn()
	)
);
