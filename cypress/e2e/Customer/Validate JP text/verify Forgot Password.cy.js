describe('Forgot Password Customer', () => {
  it('Forgot Passwords Customer', () => {
    cy.viewport('iphone-6');
    cy.log('Visiting the URL');
    const resetMobileNumber = '09055555555'
    cy.visit(Cypress.env('customer') + '/Home/ForgotPassword');
    cy.checkTextWithAttributes('ForgotPassword')
    cy.get('.contactNumber').type(resetMobileNumber)
    cy.get('#btnCl').click().wait(2000)
    cy.checkTextWithAttributes('ForgotPasswordOTP')
  })

})