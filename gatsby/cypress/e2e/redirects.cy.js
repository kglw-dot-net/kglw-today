describe('redirects', () => {
  describe('`/yyyy-mm-dd`', () => {
    it('routes to `kglw.net` setlist page', () => {
      cy.visit('/2015-07-16')
      cy.origin('https://kglw.net', () => {
        cy.get('body').find('h1').should('contain', 'July 16, 2015')
        cy.get('body').find('h1').should('contain', 'Parque das Nações') // note that "das" is lowercase in the HTML
        cy.get('body').find('h1').should('contain', 'Lisbon, Portugal')
        cy.url().should('match', /july-16-2015/)
        cy.url().should('match', /portugal/)
        cy.url().should('match', /src=kglw\.today&campaign=2015/)
      })
    })
  })
})
