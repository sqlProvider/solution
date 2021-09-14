//#region Global Imports
import { noop, Injection, InjectionScope, Scope, Tree } from '@solution/core';
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

		class SomeService {
			public name: string = 'SomeService';
		}

		class SubSubService {
			public name: string = 'SubSubService';
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
				private someService: SomeService,
				@Scope(InjectionScope.Self) private subService: SubService
			) {
				expect(rootService instanceof RootService).toBeTrue();
				expect(someService instanceof SomeService).toBeTrue();
				expect(subService instanceof SubService).toBeTrue();

				this.runSpecs();
			}

			private runSpecs(): void {
				expect(this.rootService.name).toBe('RootService');
				expect(this.someService.name).toBe('SomeService');
				expect(this.subService.name).toBe('SubService');

				this.rootService.name = 'SMASHED';
				this.someService.name = 'SMASHED';

				this.subService.runSpecs();
			}
		}

		noop(new (SomeProvider as any)());
	});
});
