//#region Global Imports
import { InjectionProvider, InjectionScope, InjectionToken, IDisposable, Noop, Type, noop, Tree } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/di/provider', () => {
	const RootToken = new InjectionToken('Root');

	it('Try Inject with no args', () => {
		try {
			InjectionProvider.TryInject();
		} catch (error) {
			expect(error).toBeTruthy();
		}
	});

	it('Try Inject with empty config', () => {
		try {
			InjectionProvider.TryInject({} as any);
		} catch (error) {
			expect(error).toBeTruthy();
		}
	});

	it('Try Inject with less args', () => {
		try {
			InjectionProvider.TryInject({
				injection: Noop
			} as any);
		} catch (error) {
			expect(error).toBeTruthy();
		}
	});

	it('Try Inject', () => {
		try {
			const injection = InjectionProvider.TryInject({
				injection: Noop,
				injectionTokens: [RootToken],
				scope: InjectionScope.Root
			});
			/**
			 * Tree
			 * 	[Root]
			 * 		[Root]->[Noop]: Noop
			 */

			expect(injection).toBeInstanceOf(Noop);
		} catch (error) {
			expect(error).toBeFalsy();
		}

		// For reset tree
		(InjectionProvider as any).tree = new Tree();
	});

	it('Try Inject with root scope', () => {
		class RootScopeExample { }

		try {
			const injection = InjectionProvider.TryInject({
				injection: RootScopeExample,
				injectionTokens: [RootToken],
				scope: InjectionScope.Root
			});
			/**
			 * Tree
			 * 	[Root]
			 * 		[Root]->[RootScopeExample]: RootScopeExample
			 */

			expect(injection).toBeInstanceOf(RootScopeExample);
		} catch (error) {
			expect(error).toBeFalsy();
		}

		// For reset tree
		(InjectionProvider as any).tree = new Tree();
	});

	it('Try Inject with disposable scope', () => {
		class Service {
			public message: string = 'Service';
		}

		try {
			const service = InjectionProvider.TryInject({
				injection: Service,
				injectionTokens: [RootToken],
				scope: InjectionScope.Disposable
			}) as IDisposable<Service>;
			/**
			 * Tree
			 * 	[Root]
			 */

			expect(Type.IsFunction(service)).toBeTrue();
			/**
			 * Tree
			 * 	[Root]
			 * 		[Service]
			 * 			[Root]->[Service-1]: Service
			 */

			expect(service()).toBeInstanceOf(Service);
			service().message = 'SMASHED';

			const oldInstance = service.dispose();
			/**
			 * Tree
			 * 	[Root]
			 */

			expect(service()).toBeInstanceOf(Service);
			/**
			 * Tree
			 * 	[Root]
			 * 		[Service]
			 * 			[Root]->[Service-2]: Service
			 */

			expect(service().message).toBe('Service');

			noop(oldInstance);
		} catch (error) {
			expect(error).toBeFalsy();
		}

		// For reset tree
		(InjectionProvider as any).tree = new Tree();
	});

	it('Try Inject with self scope without parent', () => {
		class SomeService {
			public message: string = 'SomeService';
		}

		try {
			/**
			 * When using self scope parent must be provided
			 */
			InjectionProvider.TryInject({
				injection: SomeService,
				injectionTokens: [RootToken],
				scope: InjectionScope.Self
			});

			expect(true).toBeFalse();
		} catch (error) {
			expect(error).toBeTruthy();
		}

		// For reset tree
		(InjectionProvider as any).tree = new Tree();
	});

	it('Try Inject with self scope', () => {
		class SomeService {
			public message: string = 'SomeService';
		}

		class SomeProvider {
			public message: string = 'SomeService';
		}

		const provider = new SomeProvider();

		try {
			const someService = InjectionProvider.TryInject({
				injection: SomeService,
				injectionTokens: [RootToken],
				parent: provider,
				scope: InjectionScope.Self
			}) as SomeService;
			/**
			 * Tree
			 * 	[Root]
			 * 		[SomeProvider]
			 * 			[Root]->[[SomeProvider]]->[SomeService]: Service
			 */

			expect(someService.message).toBe('SomeService');
		} catch (error) {
			expect(error).toBeFalsy();
		}

		// For reset tree
		(InjectionProvider as any).tree = new Tree();
	});

	it('Try Inject with another root token', () => {
		class Provider {
			public message: string = 'Provider';
		}

		const BaseToken = new InjectionToken('BaseToken');

		try {
			const injection1 = InjectionProvider.TryInject({
				injection: Provider,
				injectionTokens: [RootToken],
				scope: InjectionScope.Root
			}) as Provider;
			/**
			 * Tree
			 * 	[Root]
			 * 		[Root]->[Provider]: Provider
			 */

			const injection2 = InjectionProvider.TryInject({
				injection: Provider,
				injectionTokens: [BaseToken]
			}) as Provider;
			/**
			 * Tree
			 * 	[BaseToken]
			 * 		[BaseToken]->[Provider]: Provider
			 * 	[Root]
			 * 		[Root]->[Provider]: Provider
			 */

			expect(injection1).toBeInstanceOf(Provider);
			expect(injection2).toBeInstanceOf(Provider);
			expect(injection1).toEqual(injection2);

			injection1.message = 'WTH!';

			expect(injection2.message).toBe('Provider');
		} catch (error) {
			expect(error).toBeFalsy();
		}

		// For reset tree
		(InjectionProvider as any).tree = new Tree();
	});

});
