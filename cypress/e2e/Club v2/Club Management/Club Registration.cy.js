describe("Club Registration From Club Panel", () => {
    const env = 'uat'
    // Delete Club
    before(() => {
        // cy.clubManagement(env, 'moment', 4)
    })
    it("Visits Registration Panel and fills the form", () => {
        
        cy.readXlsx('Excel Files/Club Data/ClubData', 'Sheet1', 7).then(data => {
            
            cy.visit(Cypress.env(env).clubUrl + '/auth/register')
            data.forEach(tableData => {
                cy.clubRegistration(tableData)

                cy.approveClub(env, tableData)

                cy.setClubCreds(env, tableData)
                
                cy.setClubDetails(tableData).wait(3000)
                cy.clearCacheData()

            })
        })

    })
})