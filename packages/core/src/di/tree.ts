//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { InjectionToken } from '@solution/core/src/di/token';
import { Type } from '@solution/core/src/type';
import { noop } from '@solution/core/src/util';
//#endregion Local Imports

//#region Definations
type Branch = Map<string, InstanceType<any> | Branch>;
const SelfInjectionToken = new InjectionToken('__SelfInstance');
//#endregion Definations

/**
 * @class Tree
 */
export class Tree {
	public branches: Branch = new Map();

	public add(injectionTokens: Array<InjectionToken>, injection: any): any | null {
		if (Type.IsArray(injectionTokens) && injectionTokens.length < 2) { return null; }
		if (!Type.IsFunction(injection)) { return null; }

		const injectionToken = injectionTokens.pop() as InjectionToken;
		const parentBranch = this.locate(this.branches, [...injectionTokens]);

		if (Type.IsNull(parentBranch)) { return null; }

		const token = injectionToken.token;
		let activeInjectionBranch: Branch = parentBranch.get(token);
		if (activeInjectionBranch instanceof Map) {
			const possibleInstance = activeInjectionBranch.get(SelfInjectionToken.token);

			if (!Type.IsUndefined(possibleInstance)) {
				return possibleInstance;
			}
		}
		else {
			activeInjectionBranch = new Map();
			parentBranch.set(token, activeInjectionBranch);
		}

		try {
			const instance = new (injection as any)(injectionTokens);
			activeInjectionBranch.set(SelfInjectionToken.token, instance);

			return instance;
		} catch (error) { noop(); }

		return null;
	}

	public remove(injectionTokens: Array<InjectionToken>): boolean {
		if (Type.IsArray(injectionTokens)) {
			const lastToken = injectionTokens.pop();
			const parent = this.locate(this.branches, injectionTokens);

			if (lastToken instanceof InjectionToken && parent instanceof Map) {
				const instances = this.resolveAllInstanceInBranch(parent.get(lastToken.token));
				while (instances.length > 0) {
					const instance = instances.pop();

					if (Type.IsFunction(instance.dispose)) {
						instance.dispose();
					}
				}

				parent.delete(lastToken.token);
			}
		}

		return false;
	}

	public resolveRealTarget(target: any): any {
		if (target?.name === 'InjectionRootAccessWrapper') {
			const possibleConstructor = target.prototype.constructor;

			if (!Type.IsUndefined(possibleConstructor)) {
				return target.prototype.constructor;
			}
		}

		return target;
	}

	public resolveAllInstanceInBranch(branch: Branch): Array<any> {
		const instances: Array<any> = [];

		for (const [_key, value] of branch) {
			if (value instanceof Map) {
				instances.push(...this.resolveAllInstanceInBranch(value));
			}
			else if (Type.IsFunction(value) || Type.IsObject(value)) {
				instances.push(value);
			}
		}

		return instances;
	}

	private locate(branch: Branch, tokens: Array<InjectionToken>): Branch | null {
		if (Type.IsArray(tokens)) {
			const token = tokens.shift() as InjectionToken;
			const target = token.token;

			if (token instanceof InjectionToken) {
				let activeBranch: Branch = branch.get(target);

				if (Type.IsUndefined(activeBranch)) {
					activeBranch = new Map();
					branch.set(target, activeBranch);
				}

				return tokens.length > 0 ? this.locate(activeBranch, tokens) : activeBranch;
			}
		}

		return null;
	}
}
