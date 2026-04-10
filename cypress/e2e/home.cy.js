describe('home page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('headline', () => {
    cy.get('h1').contains('King Gizzard History')
  })

  it('content links to a date', () => {
    cy.contains('Today is')
      .find('a')
      .contains(/^\w+ \d+$/)
  })
})
