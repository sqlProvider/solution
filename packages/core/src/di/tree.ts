//#region Global Imports
//#endregion Global Imports

//#region Local Imports
import { Error, ErrorString } from '@solution/core';
import { InjectionToken } from '@solution/core/src/di/token';
import { Type } from '@solution/core/src/type';
//#endregion Local Imports

//#region Definations
type Branch = Map<string, InstanceType<any> | Branch>;
//#endregion Definations

/**
 * @class Tree
 */
export class Tree {
	public branches: Branch = new Map();

	public add(injectionTokens: Array<InjectionToken>, injection: any): any | null {
		const { token } = injectionTokens.pop() as InjectionToken;
		const parentBranch = this.locate(this.branches, [...injectionTokens]);
		const possibleInstance: any = parentBranch.get(token);

		if (!Type.IsUndefined(possibleInstance)) {
			return possibleInstance;
		}

		try {
			const instance = new (injection as any)(injectionTokens);

			parentBranch.set(token, instance);

			return instance;
		} catch (error) {
			return new Error({ from: 'InjectionProvide -> Tree.add()', error }, ErrorString.TreeInjectionCreate);
		}
	}

	public remove(injectionTokens: Array<InjectionToken>): void {
		const { token } = injectionTokens.pop() as InjectionToken;
		const parent = this.locate(this.branches, [...injectionTokens]);
		const instances: Array<any> = [];
		const branchOrToken = parent.get(token);

		if (branchOrToken instanceof Map) {
			instances.push(...this.resolveInstancesInBranch(branchOrToken));
		}
		else {
			instances.push(branchOrToken);
		}

		while (instances.length > 0) {
			const instance = instances.pop();

			if (Type.IsFunction(instance.dispose)) {
				instance.dispose();
			}
		}

		parent.delete(token);
	}

	public resolveInstancesInBranch(branch: Branch): Array<any> {
		const instances: Array<any> = [];

		for (const [_key, value] of branch) {
			if (value instanceof Map) {
				instances.push(...this.resolveInstancesInBranch(value));
			}
			else if (Type.IsFunction(value) || Type.IsObject(value)) {
				instances.push(value);
			}
		}

		return instances;
	}

	private locate(branch: Branch, tokens: Array<InjectionToken>): Branch {
		const { token } = tokens.shift() as InjectionToken;
		let activeBranch: Branch = branch.get(token);

		if (Type.IsUndefined(activeBranch)) {
			activeBranch = new Map();
			branch.set(token, activeBranch);
		}

		return tokens.length > 0 ? this.locate(activeBranch, tokens) : activeBranch;
	}
}
