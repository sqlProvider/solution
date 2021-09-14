//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { InjectionScope } from '@solution/core/src/di/metadata/scope/scope';
import { RootInjectionToken } from '@solution/core/src/di/metadata/token';
import { InjectionToken } from '@solution/core/src/di/token';
import { Tree } from '@solution/core/src/di/tree';
import { Type } from '@solution/core/src/type';
//#endregion Local Imports

export class InjectionProvider {
	private static tree: Tree = new Tree();

	public static TryInject<Injection>(
		parent: any,
		injection: Injection,
		injectionTokens: Array<InjectionToken>,
		scope: InjectionScope,
		token?: InjectionToken
	): Injection | null {
		if (Type.IsFunction(injection)) {
			const target = this.tree.resolveRealTarget(injection);
			const name = target?.name;
			const isValid = name !== 'Object' && name !== 'Object';

			if (isValid) {
				switch (scope) {
					case InjectionScope.Root:
						injectionTokens = [RootInjectionToken];
						break;
					case InjectionScope.Self:
						injectionTokens.push(
							this.generateInjectionToken([...injectionTokens], parent, injectionTokens.length)
						);
						break;

					default:
						if (token instanceof InjectionToken) {
							injectionTokens = [token];
						}
						break;
				}

				const injectionToken = this.generateInjectionToken([...injectionTokens], injection);

				return this.tree.add<Injection>([...injectionTokens, injectionToken], injection);
			}
		}

		return null;
	}

	private static generateInjectionToken<Injection>(tokens: Array<InjectionToken>, _injection: Injection, from: number = 0): InjectionToken {
		const keys: Array<string> = [];
		const injection = this.tree.resolveRealTarget(_injection);
		tokens.splice(0, from);

		tokens.forEach(token => keys.push(token.token.toString()));

		if (Type.IsFunction(injection) && Type.IsString(injection.name)) {
			keys.push(injection.name);
		}
		else {
			keys.push(injection as any);
		}

		return new InjectionToken(`[${keys.join(']->[')}]`);
	}
}
