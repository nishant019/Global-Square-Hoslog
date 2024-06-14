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
                cy.clubRegPage1(tableData)
                cy.get('button').contains('契約者情報の入力へ').should("be.visible").click().wait(500)

                cy.clubRegPage2(tableData)
                cy.get('button').contains('本人確認書類のアップロードへ').should("be.visible").click().wait(500)

                cy.clubRegPage3(tableData)
                cy.get('button').contains('ホスログへの店舗掲載を申請する').should("be.visible").click().wait(2000)

                //Success Page Buttton
                cy.get('button').contains('契約者情報の入力へ').should("be.visible").click().wait(500)


                cy.approveClub(env, tableData)

                cy.setClubCreds(env, tableData)
                // For Club Details First Update

                cy.setClubDetails(tableData).wait(3000)
                cy.clearCacheData()

            })
        })

    })
})