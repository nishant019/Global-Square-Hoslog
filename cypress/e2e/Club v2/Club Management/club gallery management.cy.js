describe("Gallery management", () => {
    const env = "uat";
    const filePath = 'club_creds/uat Clubs/Credentials';


    it("Manage gallery", () => {
        cy.readXlsx('Excel Files/Club Data/ClubData', 'Sheet1').then(clubData => {
            clubData.forEach(club => {
                if (club.fillData === true) {
                    cy.fixture(filePath).then(clubCreds => {
                        clubCreds.forEach(loginData => {
                            if (club.clubNameEng === loginData.clubName) {

                                cy.clubLogin(loginData.server, loginData.userName, loginData.password);

                                cy.wait(1000);
                                const fileName = "Gallery";

                                const imageLocation = `${club.gallery}/${loginData.clubName}/Gallery`;

                                cy.getFolderContents(imageLocation).then(files => {
                                    if (files) {
                                        cy.visit(Cypress.env(env).clubUrl + '/owner/cp/information').wait(2000);
                                        cy.contains('基本情報').click().wait(2000);

                                        for (let i = 0; i < files.length; i++) {
                                            let file = files[i].toLowerCase();

                                            if (file.toLowerCase().includes("logo")) {
                                                cy.get('circle').eq(1).click({ force: true });
                                                cy.get('.css-yxkgyx').eq(0).click().wait(1000);
                                                cy.galleryPopup(clubData, loginData, fileName, "logo")

                                            }
                                            if (file.toLowerCase().includes("banner")) {
                                                cy.get('circle').eq(0).click({ force: true });
                                                cy.get('.css-5rw5ap').eq(0).click().wait(1000);
                                                cy.galleryPopup(clubData, loginData, fileName, "Banner")
                                            }
                                        }
                                        cy.get('.chakra-button').click().wait(3000)

                                        cy.contains('店舗写真').click().wait(2000);

                                        cy.get('.css-pllhgn').click()
                                    }
                                })
                            }
                        })
                    })
                }
            });
        });
    });
});

