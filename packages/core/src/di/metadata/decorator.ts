//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { DecoratorFactory, DecoratorProcessor, IAnnotated } from '@solution/core/src/decorator';
import { IInjectionAnnotation } from '@solution/core/src/di/metadata/annotation';
import { RootAccess } from '@solution/core/src/di/metadata/root';
//#endregion Local Imports

export const Injection: IAnnotated<IInjectionAnnotation | undefined> = DecoratorFactory(
	undefined,
	DecoratorProcessor.RootAccess(
		new RootAccess()
	)
);
