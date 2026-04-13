describe('homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('detects current date and then shows entries if found or "rests" message if none found', () => {
    cy.get('h1').contains(/\b\w+ \d+ in King Gizzard History/)
    cy.get('main ul li')
      .if()
        .should('exist')
      .else()
        .contains(/On \w+ \d+, the band rests/)
  })

  it('links to the Calendar', () => {
    cy.get('a').contains('Calendar of all dates')
  })
})
