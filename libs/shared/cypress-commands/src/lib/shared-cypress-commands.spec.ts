import { sharedCypressCommands } from './shared-cypress-commands';

describe('sharedCypressCommands', () => {
	it('should work', () => {
		expect(sharedCypressCommands()).toEqual('shared-cypress-commands');
	});
});
