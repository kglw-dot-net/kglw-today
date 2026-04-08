Cypress.Commands.add('getIframeBody', (iframeSelector) => {
  return cy.get(iframeSelector)
    .its('0.contentDocument.body')
    .should('not.be.empty', {timeout: 60000})
    .then(cy.wrap)
})
