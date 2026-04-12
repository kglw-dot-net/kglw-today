describe('homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('has a headline', () => {
    cy.get('h1').contains('in King Gizzard History')
  })

  it('links to the Calendar', () => {
    cy.get('a').contains('Calendar of all dates')
  })
})
