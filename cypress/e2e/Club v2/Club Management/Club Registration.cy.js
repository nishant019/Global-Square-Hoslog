describe("Club Registration From Club Panel", () => {
    const env = 'uat'
    const startIndex = 0
    const endIndex = 1
    const clubTable = 'Excel Files/Club Data/ClubData'
    // Delete Club
    // before(() => {
    //     cy.clubManagement(env, 'royal', 4).wait(5000)
    // })
    it("Visits Registration Panel and fills the form", () => {
        // cy.viewport('iphone-x');

        cy.readXlsx(clubTable, 'Sheet1').then(data => {
            data.forEach(tableData => {
                if (tableData.fillData === true) {
                    cy.clubRegistration(env, tableData)

                    cy.approveClub(env, tableData)

                    cy.setClubCreds(env, tableData)
                    // // cy.clubLogin(env,'KB1094095','Test@1234')
                    cy.setClubDetails(tableData).wait(3000)
                    cy.clearCacheData()
                }

            })
        })

    })
})