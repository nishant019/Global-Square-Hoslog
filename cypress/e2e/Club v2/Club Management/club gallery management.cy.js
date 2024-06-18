describe("Gallery management", () => {
    const env = "uat";
    const filePath = 'club_creds/uat Clubs/Credentials';

    it("Manage gallery", () => {
        cy.viewport(1080, 720);

        cy.fixture(filePath).then(clubCreds => {
            clubCreds.forEach(loginData => {
                cy.clearCacheData()

                cy.clubLogin(loginData.server, loginData.userName, loginData.password);

                cy.readXlsx('Excel Files/Club Data/ClubData', 'Sheet1', 0).then(clubData => {
                    cy.wait(1000);
                    clubData.forEach(club => {

                            const imageLocation = `${club.gallery}/${club.clubNameEng}/Gallery`;

                            cy.getFolderContents(imageLocation).then(files => {
                                cy.visit(Cypress.env(env).clubUrl + '/storeinformation').wait(1000);
                                cy.contains('基本情報').click().wait(1000);
                                cy.log(files)
                                if (files) {
                                    let logoUploaded = false;
                                    let bannerUploaded = false;

                                    for (let i = 0; i < files.length; i++) {
                                        let file = files[i].toLowerCase();

                                        if (!logoUploaded && file.includes("logo")) {
                                            logoUploaded = true;
                                            cy.get('circle').eq(1).click({ force: true });
                                            cy.get('[type="file"]').eq(0).selectFile(`${imageLocation}/${file}`, { force: true }).wait(1000);
                                            cy.get('.css-39tpl5 > .chakra-button').click().wait(1000);
                                        } else {
                                            logoUploaded = true;

                                            cy.get('circle').eq(1).click({ force: true });
                                            cy.get('[type="file"]').eq(0).selectFile(`${imageLocation}/${files[0]}`, { force: true }).wait(1000);
                                            cy.get('.css-39tpl5 > .chakra-button').click().wait(1000);
                                        }

                                        if (!bannerUploaded && file.includes("banner")) {
                                            bannerUploaded = true;
                                            cy.get('circle').eq(0).click({ force: true });
                                            cy.get('[type="file"]').eq(0).selectFile(`${imageLocation}/${file}`, { force: true }).wait(1000);
                                            cy.get('.css-39tpl5 > .chakra-button').click().wait(1000);
                                        } else {
                                            bannerUploaded = true;
                                            cy.get('circle').eq(0).click({ force: true });
                                            cy.get('[type="file"]').eq(0).selectFile(`${imageLocation}/${files[0]}`, { force: true }).wait(1000);
                                            cy.get('.css-39tpl5 > .chakra-button').click().wait(1000);
                                        }

                                        cy.get('.chakra-button').click().wait(5000);

                                        if (logoUploaded) {
                                            break;
                                        }else if(bannerUploaded){
                                            break;
                                        }
                                    }

                                    cy.visit(Cypress.env(env).clubUrl + '/storeinformation').wait(1000);
                                    cy.contains('店舗写真').click().wait(1000);

                                    files.forEach((file, index) => {
                                        cy.get('.css-pllhgn').click().wait(1000);
                                        
                                        cy.get('.css-q18k4l').eq(0).contains("Gallery").click({force:true});
                                        cy.get('.css-pcwo9u').contains("Gallery").click();

                                        cy.get('.css-ygtapu').eq(index).click().wait(500);
                                        cy.get('.css-wjnxbe > .css-145ers9').click().wait(1000);
                                    });

                                    cy.get('[data-e2e="release"]').click({ force: true });
                                }
                            });
                        
                    });
                });
            });
        });
    });
});
