//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { noop, Type } from '@solution/core';
import { InjectionToken } from '@solution/core/src/di/token';
//#endregion Local Imports

//#region Definations
type Branch = Map<Function, InstanceType<any> | Branch>;
const SelfInjectionToken = new InjectionToken('__SelfInstance');
//#endregion Definations

/**
 * @class Tree
 */
export class Tree {
	private branchs: Branch = new Map();

	public add<Injection>(tokens: Array<InjectionToken>, injection: Injection): Injection | null {
		if (Type.IsArray(tokens) && tokens.length < 2) { return null; }
		if (!Type.IsFunction(injection)) { return null; }

		const activeInjectionToken = tokens.pop() as InjectionToken;
		const parentBranch = this.locate(this.branchs, [...tokens]);

		if (Type.IsNull(parentBranch)) { return null; }

		const activeInjectionTarget = activeInjectionToken.symbol;
		let activeInjectionBranch: Branch = parentBranch.get(activeInjectionTarget);
		if (activeInjectionBranch instanceof Map) {
			const possibleInstance = activeInjectionBranch.get(SelfInjectionToken.symbol);

			if (!Type.IsUndefined(possibleInstance)) {
				return possibleInstance;
			}
		}
		else {
			activeInjectionBranch = new Map();
			parentBranch.set(activeInjectionTarget, activeInjectionBranch);
		}

		try {
			const instance = new (injection as any)(tokens);
			activeInjectionBranch.set(SelfInjectionToken.symbol, instance);

			return instance;
		} catch (error) { noop(); }

		return null;
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

	private locate(branch: Branch, tokens: Array<InjectionToken>): Branch | null {
		if (Type.IsArray(tokens)) {
			const token = tokens.shift() as InjectionToken;
			const target = token.symbol;

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
