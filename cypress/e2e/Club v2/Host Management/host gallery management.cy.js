describe("Gallery management", () => {
    const env = "uat";
    const clubName = 'Galaxy Club';

    const hostFilePath = 'Excel Files/Club Data/Host Data/Host Data';
    const filePath = 'club_creds/uat Clubs/Credentials';

    const startIndex = 0
    const endIndex = ''

    it("Manage gallery", () => {
        cy.viewport(1080, 720)
        cy.readXlsx(hostFilePath, clubName, startIndex,endIndex).then(hostDetails => {
            cy.fixture(filePath).then(clubCreds => {
                let clubData;
                for (let i = 0; i < clubCreds.length; i++) {
                    clubData = clubCreds[i];
    
                    if (clubData.clubName === clubName) {
                        cy.clubLogin(clubData.server, clubData.userName, clubData.password);
                        break;
                    }
                }
            });
            hostDetails.forEach(hostData => {
                const imageLocation = hostData.GalleryImageList + '/' + clubName + '/' + hostData.hostName

                if (hostData.GalleryImageList) {
                    cy.visit(Cypress.env(env).clubUrl + '/staff').wait(1000);
                    cy.get('.chakra-input').type(`${hostData.hostNameKatakana}{enter}`).wait(4000)
                    cy.get('[data-rbd-droppable-id="staff"] td').eq(2).click()

                    // cy.get(".css-1x2x8x9").click().wait(2000)

                    cy.getFolderContents(imageLocation).then((files) => {

                            if (files.length > 0) {
                                cy.get('.css-9p04zo').eq(0).click()
                                cy.get('.css-9p04zo').eq(0).click()
        
                                cy.get('[type="file"]').eq(0).selectFile(imageLocation + '/' + files[0],{force:true})
                                cy.get('.css-39tpl5 > .chakra-button').click().wait(1000)
                                cy.get('[type="file"]').eq(0).selectFile(imageLocation + '/' + files[0],{force:true})
                                cy.get('.css-39tpl5 > .chakra-button').click().wait(1000)
        
                                cy.get(".css-1x2x8x9").click().wait(2000)

                                files.forEach((file, index) => {

                                    cy.get(".css-1x2x8x9").click({ force: true }).wait(1000)
                                    cy.get('.css-tjq8tt').contains(hostData.hostName).click();
                                    cy.get('.css-pcwo9u').contains(hostData.hostName).click()

                                    cy.get('.css-ygtapu').eq(index).click().wait(500)
                                    cy.get('.css-wjnxbe > .css-145ers9').click().wait(1000)
                                })

                            }
                    });
                    cy.get('[data-e2e="release"]').click().wait(1000)
                }


            });
        });
    });
});

