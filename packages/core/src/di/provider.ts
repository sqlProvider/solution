//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { IInjectionProvideIn } from '@solution/core/src/di/metadata/annotation';
import { InjectionScope } from '@solution/core/src/di/metadata/scope';
import { RootInjectionToken } from '@solution/core/src/di/metadata/token';
import { InjectionToken } from '@solution/core/src/di/token';
import { Tree } from '@solution/core/src/di/tree';
import { Type } from '@solution/core/src/type';
//#endregion Local Imports

export class InjectionProvider {
	public static TryInject<Injection>(
		parent: any,
		injection: Injection,
		injectionTokens: Array<InjectionToken>,
		provideInConfig: IInjectionProvideIn | undefined
	): Injection | null {
		if (Type.IsFunction(injection)) {
			const target = this.tree.resolveRealTarget(injection);
			const parentTarget = this.tree.resolveRealTarget(parent);
			const name = target.name;
			const isValid = name !== 'Object' && name !== 'Object';

			if (isValid) {
				const scope = (provideInConfig || {})[name]?.scope;
				const token = (provideInConfig || {})[name]?.token;
				const injectionToken = new InjectionToken(target);

				switch (scope) {
					case InjectionScope.Root:
						injectionTokens = [RootInjectionToken];
						break;
					case InjectionScope.Self:
						injectionTokens.push(new InjectionToken(parentTarget));
						break;

					default:
						if (token instanceof InjectionToken) {
							injectionTokens = [token];
						}
						break;
				}

				return this.tree.add<Injection>([...injectionTokens, injectionToken], injection);
			}
		}

		return null;
	}

	private static tree: Tree = new Tree();
}
