describe('homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('headline', () => {
    cy.get('h1').contains('Today in King Gizzard History')
  })

  it('content links to a date', () => {
    cy.contains('Today is')
      .find('a')
      .contains(/^\w+ \d+$/)
  })

  describe('calendar component', () => {
    it('shows a link for every day in the (leap) year', () => {
      cy.get('.calendar')
        .find('a')
        .its('length')
        .should('eq', 366);
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
})
