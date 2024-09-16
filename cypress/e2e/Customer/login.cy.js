describe('Login Customer', () => {

    it('Logins Customer', () => {
        const env = 'uat'
        cy.viewport('iphone-x');
        cy.log('Visiting the URL');

        cy.visit(Cypress.env(env).customerUrl + 'login');
        // cy.checkTextWithAttributes('Login')
        cy.typeText([
            ['#LoginId', 'cure', 1, ''],
            ['#Password', 'Test@123', 1, '']
        ])
        cy.get('#FormSubmit').click()
    })

})