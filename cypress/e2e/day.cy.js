describe('day page', () => {
  describe('basic contents', () => {
    beforeEach(() => {
      cy.visit('/jul-16')
    })

    it('headline', () => {
      cy.get('h1').contains('July 16 in King Gizzard History')
    })

    it('shows the different years', () => {
      cy.contains('2011')
      cy.contains('2015')
      cy.contains('2016')
      cy.get('body').should('not.contain', '2010')
      cy.get('body').should('not.contain', '2014')
    })
  })

  describe('link types', () => {
    it('shows the dates and venues of concerts', () => {
      cy.visit('/oct-18')
      cy.contains('2014 Oct 18')
        .contains('Subterranean')
      cy.contains('2019 Oct 18')
        .contains('La Riviera, Madrid')
      cy.contains('2022 Oct 18')
        .contains('History, Toronto')
    })

    it('shows the dates and names of singles', () => {
      cy.visit('/oct-18')
      cy.contains('2017 Oct 18')
      cy.contains('Crumbling Castle single')
    })

    it('shows the dates and names of albums', () => {
      cy.visit('/oct-11')
      cy.contains('Made in Timeland')
        .closest('li')
        .as('albumEntry')
      cy.log('album title and link')
      cy.get('@albumEntry')
        .contains('2022 Oct 11')
      cy.get('@albumEntry')
        .find('a')
        .should('have.attr', 'href')
        .then(href => cy.wrap(href).should('eq', 'https://kglw.net/releases/made-in-timeland?src=kglw.today'))
      cy.log('release note')
      cy.get('@albumEntry')
        .find('span')
        .should('have.attr', 'title')
        .then(t => cy.wrap(t).should('eq', 'digital streaming release'))
    })

    it('shows birthdays', () => {
      cy.visit('/oct-11')
      cy.contains('Happy Birthday to Joey')
    })

    it('shows other dates', () => {
      cy.visit('/oct-9')
      cy.contains('Carlton Dry Global Music Grant')
      cy.visit('/oct-19')
      cy.contains('KGLW.net launches!')
    })
  })

})
