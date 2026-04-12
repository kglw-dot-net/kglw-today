Cypress.Commands.add('getIframeBody', (iframeSelector: string) => {
  return cy.get(iframeSelector)
    .its('0.contentDocument.body')
    .should('not.be.empty', { timeout: 60000 })
    .then(cy.wrap)
})

declare global {
  namespace Cypress {
    interface Chainable {
      getIframeBody(iframeSelector: string): Chainable<JQuery<HTMLBodyElement>>
    }
  }
}
