describe('/calendar page', () => {
  beforeEach(() => {
    cy.visit('/calendar')
  })

  it('headline', () => {
    cy.get('h1').contains('King Gizzard History Calendar')
  })

  it('shows a link for every day in the (leap) year', () => {
    cy.get('.calendar')
      .find('a')
      .its('length')
      .should('eq', 366)
  })

  it('should link to date page proper URL', () => {
    cy.get('.calendar')
      .find('a')
      .contains('Jul 16')
      .first()
      .should('have.attr', 'href')
      .then(href => cy.wrap(href).should('eq', '/jul-16'))
  })
})
