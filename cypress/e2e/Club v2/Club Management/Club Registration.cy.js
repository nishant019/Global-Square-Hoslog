describe("Club Registration From Club Panel", () => {
    const env = 'uat'
    const startIndex = 0
    const endIndex = ''
    const clubTable =  'Excel Files/Club Data/ClubData'
    // Delete Club
    before(() => {
        // cy.clubManagement(env, 'moment', 4)
    })
    it("Visits Registration Panel and fills the form", () => {
        
        cy.readXlsx(clubTable, 'Sheet1', startIndex,endIndex).then(data => {
            
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