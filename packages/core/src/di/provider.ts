//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { InjectionScope } from '@solution/core/src/di/metadata/scope/scope';
import { RootInjectionToken } from '@solution/core/src/di/metadata/token';
import { InjectionToken } from '@solution/core/src/di/token';
import { Tree } from '@solution/core/src/di/tree';
import { Error, ErrorString } from '@solution/core/src/error';
import { Type } from '@solution/core/src/type';
//#endregion Local Imports

//#region Definations
interface ITryInjectConfig {
	injection: any;
	injectionTokens: Array<InjectionToken>;
	scope?: InjectionScope;
	parent?: any;
}
//#endregion Definations

export class InjectionProvider {
	private static tree: Tree = new Tree();
	private static disposableIndex: number = 0;

	public static TryInject(config: ITryInjectConfig = {} as ITryInjectConfig): any | null {
		const { injection, parent, scope } = config;
		let { injectionTokens } = config;

		if (!Type.IsFunction(injection)) {
			return this.error({ ...config, reason: ErrorString.InstanceConfigInjection });
		}
		if (!Type.IsArray(injectionTokens)) {
			return this.error({ ...config, reason: ErrorString.InstanceConfigInjectionTokens });
		}
		else {
			const isValidChain = injectionTokens.every(injectionToken => injectionToken instanceof InjectionToken);

			if (!isValidChain) {
				return this.error({ ...config, reason: ErrorString.InstanceConfigInjectionTokensNotValid });
			}
		}

		const target = this.resolveRealTarget(injection);
		const name = target?.name;
		const isValid = name !== 'Object';

		if (isValid) {
			switch (scope) {
				case InjectionScope.Root:
					injectionTokens = [RootInjectionToken];

					break;

				case InjectionScope.Self:
					if (Type.IsFunction(parent) || Type.IsObject(parent)) {
						injectionTokens.push(
							this.generateInjectionToken([], parent)
						);

						break;
					}

					return this.error({ ...config, reason: ErrorString.InstanceConfigScopeSelf });

				case InjectionScope.Disposable:
					return this.disposableWrapper(config);

				default:
					break;
			}

			if (injectionTokens.length === 0) {
				return this.error({ ...config, reason: ErrorString.InstanceConfigZeroToken });
			}

			const injectionToken = this.generateInjectionToken([...injectionTokens], injection);

			return this.tree.add([...injectionTokens, injectionToken], injection);
		}

		return this.error({ ...config, reason: ErrorString.InstanceConfigNotValid });
	}

	public static resolveRealTarget(target: any): any {
		if (Type.IsFunction(target) && target.name === 'InjectionRootAccessWrapper') {
			const possibleConstructor = target.prototype.constructor;

			if (!Type.IsUndefined(possibleConstructor)) {
				return target.prototype.constructor;
			}
		}

		return target;
	}

	private static generateInjectionToken(tokens: Array<InjectionToken>, _injection: any): InjectionToken {
		const keys: Array<string> = [];
		const injection = this.resolveRealTarget(_injection);

		tokens.forEach(token => keys.push(token.token.toString()));
		keys.push(injection.name);

		return new InjectionToken(`[${keys.join(']->[')}]`);
	}

	private static disposableWrapper(config: ITryInjectConfig): any {
		const { injection, injectionTokens, parent } = config;
		let selfInjection: any;

		// Parent Injection Token
		if (Type.IsFunction(parent)) {
			injectionTokens.push(this.generateInjectionToken([], parent));
		}

		const selfToken = this.generateInjectionToken([], injection);
		const injectionToken = this.generateInjectionToken([...injectionTokens], injection);
		const tokens = [...injectionTokens, selfToken];

		this.increaseDispoableIndex(injectionToken);

		const DisposableWrapper = () => selfInjection || (selfInjection = this.tree.add([...tokens, injectionToken], injection));

		DisposableWrapper.dispose = () => {
			const oldInjection = selfInjection;
			selfInjection = undefined;

			this.tree.remove([...tokens]);
			this.increaseDispoableIndex(injectionToken);

			return oldInjection;
		};

		return DisposableWrapper;
	}

	private static increaseDispoableIndex(injectionToken: InjectionToken): any {
		injectionToken.token = injectionToken.token.replace(/(\]|-\d\])$/, `-${++this.disposableIndex}]`);
	}

	private static error(config: any): null {
		throw new Error({ ...config, from: 'InjectionProvider -> TryInject'}, ErrorString.InstanceConfig);
	}
}
