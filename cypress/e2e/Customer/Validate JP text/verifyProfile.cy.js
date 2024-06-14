
describe('template spec', () => {
  it('passes', () => {
    cy.viewport('iphone-6');
    cy.log('Visiting the URL');
    cy.visit(Cypress.env('customer') + '/Home/Index');
    cy.get('#LoginId').type('09022222222')
    cy.get('#Password').type('Test@123')
    cy.get('#FormSubmit').click()
    cy.visit(Cypress.env('customer') + '/ProfileManagement/Index');
    cy.checkTextWithAttributes('ProfileManagement.json');


  });
});
