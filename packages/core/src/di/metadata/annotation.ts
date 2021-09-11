//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { InjectionScope } from '@solution/core/src/di/metadata/scope';
import { InjectionToken } from '@solution/core/src/di/token';
//#endregion Local Imports

export interface IInjectionAnnotation {
	provideIn?: IInjectionProvideIn;
}

export interface IInjectionProvideIn {
	[key: string]: IInjectionProvideConfig;
}

export interface IInjectionProvideConfig {
	scope: InjectionScope;
	token?: InjectionToken;
}
