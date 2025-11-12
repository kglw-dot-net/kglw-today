describe('iframe', () => {
  beforeEach(() => {
    cy.visit('/now')
  })
  it('shows an iframe with content for the day', () => {
    cy.get('iframe')
      .should('have.attr', 'src')
      .should('not.be.empty')
      .should('match', /\?ui=sparse$/)
    cy.log('heading shows month name and date')
    let dateTrim
    cy.getIframeBody('iframe')
      .find('h1')
      .contains(/^\w+ \d+\b/)
      .then((elem) => {
        const [month, date] = elem.text().split(/\s/).slice(0, 2)
        dateTrim = `${month.slice(0,3)} ${date}`
      })
    cy.log('below the heading either lists things on that day or has the "rests" message')
    cy.getIframeBody('iframe')
      .find('h1')
      .next()
      .then(($elem) => {
        cy.wrap($elem)
          .contains(new RegExp(`the band rests|${dateTrim}`))
      })
    cy.log('nav links are not visible')
    cy.getIframeBody('iframe')
      .find('.nav')
      .should('not.exist')
  })
})
