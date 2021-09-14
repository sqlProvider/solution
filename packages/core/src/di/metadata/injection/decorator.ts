//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { DecoratorFactory, DecoratorProcessor } from '@solution/core/src/decorator';
import { RootAccess } from '@solution/core/src/di/metadata/injection/root';
//#endregion Local Imports

export const Injection = DecoratorFactory(
	undefined,
	DecoratorProcessor.RootAccess(
		new RootAccess()
	)
);
