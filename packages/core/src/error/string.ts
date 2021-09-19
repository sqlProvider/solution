//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { LiteralTemplate } from '@solution/core/src/util/literal-template';
//#endregion Local Imports

/**
 * @enum ErrorString
 */
export const ErrorString = {
	DecoratorProcessorInstance: LiteralTemplate`[${'from'}]: Processors must be instance of [${'from'}]`,

	InstanceConfig: LiteralTemplate`[${'from'}]: ${'reason'}.`,
	InstanceConfigInjection: 'Injection not function',
	InstanceConfigInjectionTokens: 'Injection tokens must be an array',
	InstanceConfigInjectionTokensNotValid: 'Injection tokens not valid',
	InstanceConfigNotValid: 'Injection is not valid',
	InstanceConfigScopeSelf: 'Parent paremeter must be provide for self scope',
	InstanceConfigZeroToken: 'For generate injection token scope or token paremeter must be provide',

	TreeInjectionCreate: LiteralTemplate`[${'from'}]: Errored when creating injection;`
};

Object.freeze(ErrorString);
