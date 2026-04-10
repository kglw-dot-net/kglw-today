describe('homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('headline', () => {
    cy.get('h1').contains('in King Gizzard History')
  })
})
