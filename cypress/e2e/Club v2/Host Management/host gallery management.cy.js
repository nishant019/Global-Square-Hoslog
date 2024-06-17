describe("Gallery management", () => {
    const env = "uat";
    const clubName = 'Galaxy Club';

    const hostFilePath = ['Excel Files/Club Data/Host Data/Host Data', clubName, 0];
    const filePath = 'club_creds/uat Clubs/Credentials';
    before("Login to club", () => {


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
    });

    it("Manage gallery", () => {
        cy.viewport(1080, 720)
        cy.readXlsx(hostFilePath[0], hostFilePath[1], hostFilePath[2]).then(hostDetails => {

            hostDetails.slice(0, 1).forEach(hostData => {
                const imageLocation = hostData.GalleryImageList + '/' + clubName + '/' + hostData.hostName

                if (hostData.GalleryImageList) {
                    cy.visit(Cypress.env(env).clubUrl + '/staff').wait(1000);
                    cy.get('.chakra-input').type(`${hostData.hostNameKatakana}{enter}`).wait(4000)
                    cy.get('[data-rbd-droppable-id="staff"] td').eq(2).click()


                    cy.get(".css-1x2x8x9").click().wait(2000)




                    cy.getFolderContents(imageLocation).then((files) => {
                        if (files) {
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

