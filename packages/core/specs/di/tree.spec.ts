//#region Global Imports
import { noop, InjectionToken, Tree } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

/**
 * Tree is a special class for DI and should respond quickly.
 * So, I reduce the controls. These are Best-case tests.
 */

describe('@solution/core/di/tree', () => {
	/**
	 * Every tree has a root :)
	 */
	const BaseToken: InjectionToken = new InjectionToken('Foo');
	const tree = new Tree();

	it('Add', () => {
		class Foobar { }

		const token = new InjectionToken(Foobar.name);

		try {
			const injection = tree.add([BaseToken, token], Foobar);

			expect(injection).toBeInstanceOf(Foobar);
		} catch (error) {
			expect(false).toBeTruthy();
		}
	});

	it('Remove', () => {
		class Bar { }

		const token = new InjectionToken(Bar.name);

		try {
			const injection = tree.add([BaseToken, token], Bar);

			expect(injection).toBeInstanceOf(Bar);
		} catch (error) {
			expect(false).toBeTruthy();
		}

		tree.remove([BaseToken, token]);

		const rootBranch = tree.branches.get(BaseToken.token);

		if (rootBranch instanceof Map) {
			expect(rootBranch.get(token.token)).toBeUndefined();
		}
		else {
			expect(true).toBeFalse();
		}
	});

	it('Resolve All Instance In Branch', () => {
		class Foo { }

		const token = new InjectionToken(Foo.name);
		const injection = tree.add([BaseToken, token], Foo);

		noop(injection);

		const rootBranch = tree.branches.get(BaseToken.token);
		const instances = tree.resolveInstancesInBranch(rootBranch);

		expect(instances.length).toBeGreaterThan(0);
	});

	it('Multiple Roots', () => {
		class Service {
			public message: string = 'Service';
		}

		const RootToken = new InjectionToken('Root');
		const token = new InjectionToken(Service.name);

		const serviceInFoo = tree.add([BaseToken, token], Service) as Service;
		const serviceInRoot = tree.add([RootToken, token], Service) as Service;

		expect(serviceInFoo.message).toBe(serviceInRoot.message);

		serviceInFoo.message = 'SMASHED';

		expect(serviceInRoot.message).toBe('Service');
	});

	it('Multiple Add', () => {
		class Provider {
			public message: string = 'Provider';
		}

		const token = new InjectionToken(Provider.name);
		const provider1 = tree.add([BaseToken, token], Provider) as Provider;
		const provider2 = tree.add([BaseToken, token], Provider) as Provider;

		expect(provider1.message).toBe(provider2.message);

		provider1.message = 'SMASHED';

		expect(provider1.message).toBe(provider2.message);

		expect(provider1).toEqual(provider2);
	});
});
