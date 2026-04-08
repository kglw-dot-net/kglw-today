/// <reference types="cypress" />

// getIframeBody — drill into an iframe's document body.
// The long timeout is needed because the iframe src is set client-side on
// mount, so the inner document takes a moment to load after page paint.
Cypress.Commands.add('getIframeBody', (iframeSelector: string) => {
  return cy
    .get(iframeSelector)
    .its('0.contentDocument.body')
    .should('not.be.empty', { timeout: 60000 })
    .then((body) => cy.wrap(body as JQuery<HTMLBodyElement>))
})

// Extend the Cypress Chainable interface so TypeScript knows about the custom command.
declare global {
  namespace Cypress {
    interface Chainable {
      getIframeBody(iframeSelector: string): Chainable<JQuery<HTMLBodyElement>>
    }
  }
}

export {}
