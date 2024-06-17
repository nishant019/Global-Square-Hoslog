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
        cy.readXlsx('Excel Files/Club Data/ClubData', 'Sheet1', 7).then(clubData => {
            cy.wait(1000)
            clubData.forEach(club => {
                // const imageLocation = club.GalleryImageList.replace('{{club_name}}', clubName).replace('{{host_name}}', club.hostName)

                if (club.clubNameEng === clubName) {
                    const imageLocation = club.gallery + '/' + clubName + '/Gallery'
                    cy.visit(Cypress.env(env).clubUrl + '/storeinformation').wait(1000);
                    cy.contains('店舗写真').click().wait(1000)

                    cy.getFolderContents(imageLocation).then((files) => {
                        if (files) {
                            files.forEach((file, index) => {
                                cy.get('.css-pllhgn').click().wait(1000)

                                // cy.get(".css-1x2x8x9").click({ force: true }).wait(1000)
                                cy.get('.css-tjq8tt').contains("Gallery").click();
                                cy.get('.css-pcwo9u').contains("Gallery").click()

                                cy.get('.css-ygtapu').eq(index).click().wait(500)
                                cy.get('.css-wjnxbe > .css-145ers9').click().wait(1000)
                            })
                            cy.get('[data-e2e="release"]').click({force:true})

                        }
                    });
                }




            });
        });
    });
});

