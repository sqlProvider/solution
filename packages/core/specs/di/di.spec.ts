//#region Global Imports
import { noop, Injection, InjectionScope, IDisposable, Scope, Tree } from '@solution/core';
//#endregion Global Imports

//#region Local Imports
//#endregion Local Imports

describe('@solution/core/di', () => {
	it('is Injection works', () => {
		@Injection()
		class Target {
			constructor(tree: Tree) {
				expect(tree instanceof Tree).toBeTrue();
			}
		}

		noop(new (Target as any)());
	});

	it('is Injection works with Self', () => {
		class RootService {
			public name: string = 'RootService';
		}

		class SubSubService {
			public name: string = 'SubSubService';
		}

		@Injection()
		class SomeService {
			constructor(
				subSubService: SubSubService
			) {
				expect(subSubService instanceof SubSubService).toBeTrue();
			}
			public name: string = 'SomeService';
		}

		@Injection()
		class SubService {
			constructor(
				@Scope(InjectionScope.Root) private rootService: RootService,
				@Scope(InjectionScope.Self) private subSubService: SubSubService,
				private someService: SomeService
			) {
				expect(rootService instanceof RootService).toBeTrue();
				expect(someService instanceof SomeService).toBeTrue();
				expect(subSubService instanceof SubSubService).toBeTrue();
			}

			public name: string = 'SubService';

			public runSpecs(): void {
				expect(this.rootService.name).toBe('SMASHED');
				expect(this.someService.name).toBe('SomeService');
				expect(this.subSubService.name).toBe('SubSubService');
			}
		}

		@Injection()
		class SomeProvider {
			constructor(
				private rootService: RootService,
				@Scope(InjectionScope.Disposable) someService: SomeService,
				@Scope(InjectionScope.Self) private subService: SubService
			) {
				expect(rootService instanceof RootService).toBeTrue();
				expect(subService instanceof SubService).toBeTrue();
				expect(someService instanceof Function).toBeTrue();

				this.someService = someService as any;

				this.runSpecs();
			}

			private someService: IDisposable<SomeService>;

			private runSpecs(): void {
				expect(this.rootService.name).toBe('RootService');
				expect(this.someService().name).toBe('SomeService');
				expect(this.subService.name).toBe('SubService');

				this.rootService.name = 'SMASHED';
				this.someService().name = 'SMASHED';

				this.subService.runSpecs();

				this.someService.dispose();
				this.someService().name = 'SMASHED';
				this.someService.dispose();
			}
		}

		noop(new (SomeProvider as any)());
	});
});
