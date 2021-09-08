import { Core } from '@solution/core';

describe("A Spec for Core Module", function () {
	it("is core truthy", function () {
		const core = new Core();

		expect(core instanceof Core).toBe(true);
	});

	it("is Core.toString method truthy", function () {
		const core = new Core();

		expect(core.toString()).toBe('Core');
	});
});
