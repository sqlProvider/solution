//#region Global Imports
import { noop, Injection, InjectionScope, Tree } from '@solution/core';
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
		@Injection()
		class RootService {
			public name: string = 'RootService';
		}

		@Injection()
		class SomeService {
			public name: string = 'SubService';
		}

		@Injection({
			provideIn: {
				'RootService': { scope: InjectionScope.Root }
			}
		})
		class SubService {
			constructor(private rootService: RootService, private someService: SomeService) {
				expect(rootService instanceof RootService).toBeTrue();
				expect(someService instanceof SomeService).toBeTrue();
			}

			public name: string = 'SomeService';

			public runSpecs(): void {
				expect(this.rootService.name).toBe('SMASHED');
				expect(this.someService.name).toBe('SomeService');
			}
		}

		@Injection({
			provideIn: {
				'SomeService': { scope: InjectionScope.Self }
			}
		})
		class SomeProvider {
			constructor(
				private rootService: RootService,
				private someService: SomeService,
				private subService: SubService
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
				this.subService.name = 'SMASHED';

				this.subService.runSpecs();
			}
		}

		noop(new (SomeProvider as any)());
	});
});
