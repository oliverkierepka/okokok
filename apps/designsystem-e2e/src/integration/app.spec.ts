import { getGreeting } from '../support/app.po';

describe('designsystem', () => {
	beforeEach(() => cy.visit('/'));

	it('should display welcome message', () => {
		cy.getEl('headline').contains('Hello there');
		// Function helper example, see `../support/app.po.ts` file
		getGreeting().contains('Welcome designsystem');
	});
});
