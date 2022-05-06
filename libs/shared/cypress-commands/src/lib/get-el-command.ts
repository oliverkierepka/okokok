// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface Chainable<Subject> {
		getEl(identifier: string): Cypress.Chainable<JQuery<HTMLElement>>;
	}
}
//
// -- This is a parent command --
Cypress.Commands.add('getEl', (identifier) => {
	return cy.get(`[data-testid="${identifier}"]`);
});
