describe('Login Customer', () => {
  it('Logins Customer', () => {
      cy.viewport('iphone-6');
      cy.log('Visiting the URL');

      cy.visit(Cypress.env('customer') + '/Home/Index');
      cy.checkTextWithAttributes('Login')
  })

})