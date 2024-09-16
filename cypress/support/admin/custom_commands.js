Cypress.Commands.add('approveClub', (env, tableData) => {
    cy.visit(Cypress.env(env).adminUrl)
    cy.log(tableData)
    cy.adminLogin(env)
    cy.visit(Cypress.env(env).adminUrl + '/ClubManagement/ClubList')
    cy.get('#tab2Link').click()
    
    // Search for the club by English name
    cy.get('#default-search-pending').type(`${tableData.clubNameEng}{enter}`)

    // Clicking the first club in the table
    cy.get('#table-id > tbody svg').eq(0).click().wait(500)

    // Intercept the request that will reload on approve
    cy.intercept('GET', '**/ClubManagement/ClubList*').as('clubListReload')

    // Click approve button
    cy.get('#approve_id').click()

    // Wait for the search request or reload after approve
    cy.wait('@clubListReload').then(() => {
        cy.log('Club approved and list reloaded successfully.')
    })
})



Cypress.Commands.add('clubManagement', (env, clubName, action) => {
    cy.adminLogin(env);
    cy.visit(Cypress.env(env).adminUrl + '/ClubManagement/ClubList');
    cy.get('#default-search').type(`${clubName}{enter}`).wait(1000);

    switch (action) {
        case 1:
            // Edit action
            cy.get('.la-edit').click().wait(1000);
            break;
        case 2:
            // Manager setting action
            cy.get('[src="/Content/assets/images/manager-setting.svg"]').click().wait(1000);
            break;
        case 3:
            // Tag action
            cy.get('.la-tag').click().wait(1000);
            break;
        case 4:
            // Delete action
            cy.get('.la-trash-alt').click().wait(1000);
            break;
        case 5:
            // Key action
            cy.get('.la-key').click().wait(1000);
            break;
        case 6:
            // Notice action
            cy.get('[src="/Content/assets/images/notice.svg"]').click().wait(1000);
            break;
        case 7:
            // User action
            cy.get('.la-user').click().wait(1000);
            break;
        case 8:
            // Calendar check action
            cy.get('.la-calendar-check').click().wait(1000);
            break;
        case 9:
            // Schedule action
            cy.get('[src="/Content/assets/images/schedule.svg"]').click().wait(1000);
            break;
        case 10:
            // Other action
            cy.get('a > .las').click().wait(1000);
            break;
        default:
            // No action or invalid action
            cy.log('No valid action provided');
    }
});

Cypress.Commands.add('getClubUserName', (env, clubName) => {
    cy.clubManagement(env, clubName, 1);
    cy.get('[name="LoginId"]').invoke('val').then(username => {
        cy.log(username);
        cy.wrap(username).as('clubUsername');  // Store the username as an alias
        cy.get('.flex > .resetForm').click();
    });
});

Cypress.Commands.add('resetClubPassword', (env, clubName, newPassword) => {

    cy.getClubUserName(env, clubName)


    cy.clubManagement(env, clubName, 5)
    cy.get('#reset_customer_id').click().wait(500)
    cy.visit(Cypress.env(env).adminUrl + '/SMSLog')
    cy.get('tbody td').eq(2).then(e => {
        const sms = e[0].innerText;

        let passwordRegex = /Your password is ([^\s]+)/;

        let passwordMatch = sms.match(passwordRegex);

        let password = passwordMatch ? passwordMatch[1] : "Password not found";
        cy.get('@clubUsername').then(userName => {
            cy.clubLogin(env, userName, password)

            cy.setNewPassword(newPassword)
            cy.storeCreds(env, userName, newPassword, "")
            cy.clubLogin(env, userName, newPassword)
        })
    });
})