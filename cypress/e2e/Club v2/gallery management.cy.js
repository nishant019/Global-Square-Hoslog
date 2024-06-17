describe("Gallery management", () => {
    const env = "uat";
    const clubName = 'Moment Club';

    const hostFilePath = ['Excel Files/Club Data/Host Data/Host Data', clubName, 0];
    const filePath = 'club_creds/uat Clubs/Credentials';
    before("Login to club", () => {


        cy.fixture(filePath).then(clubCreds => {
            let clubData;
            for (let i = 0; i < clubCreds.length; i++) {
                clubData = clubCreds[i];

                if (clubData.clubName === clubName) {
                    cy.clubLogin(clubData.server, clubData.userName, clubData.password);
                    break; // Break the loop when the condition matches
                }
            }
        });
    });

    it("Manage gallery", () => {
        cy.readXlsx(hostFilePath[0], hostFilePath[1], hostFilePath[2]).then(hostDetails => {
            hostDetails.slice(0).forEach(hostData => {
                cy.visit(Cypress.env(env).clubUrl + '/media').wait(2000);

                // Check for folder name; if it doesn't exist, create the folder
                cy.get('body').then($body => {
                    const elementsContainingText = $body.find('*').filter((index, element) => {
                        return Cypress.$(element).text().includes(hostData.hostName);
                    });

                    if (elementsContainingText.length > 0) {
                        // Folder exists; navigate to it
                        cy.get('.css-tjq8tt').contains(hostData.hostName).click();
                        cy.get('.css-pcwo9u').contains(hostData.hostName).click();
                    } else {
                        // Folder doesn't exist; create it
                        cy.log(`No elements found with text "${hostData.hostName}"`);

                        cy.get('.css-wuwme8').click();
                        cy.typeText([
                            ['[name="FolderName"]', hostData.hostName, 0, ''],
                            ['[name="LabelName"]', hostData.hostName, 0, '']
                        ]);
                        cy.get('button').contains("追加").click().wait(1000);

                        cy.visit(Cypress.env(env).clubUrl + '/media').wait(2000);
                        cy.get('.chakra-button').click().wait(2000)
                        cy.dropdown([
                            ['[name="selectFolder"]', hostData.hostName, 0, ''],
                            ['[name="selectLabel"]', hostData.hostName, 0, ''],

                        ])
                        
                        cy.get('button').contains("追加").click().wait(1000);
                        cy.get('.css-tjq8tt').contains(hostData.hostName).click();
                        cy.get('.css-pcwo9u').contains(hostData.hostName).click();
                    }

                    // Upload gallery images
                    if (hostData.GalleryImageList) {
                        const galleryImageArr = JSON.parse(hostData.GalleryImageList);
                        galleryImageArr.forEach((image, index) => {
                            cy.get('[type="file"]').eq(0).selectFile(image, { force: true }).wait(1000);
                            cy.typeText([
                                ['[name="titleImage"]', Cypress._.random(99999999999, 9999999999999999).toString(), 0, ''],
                            ]);
                            cy.get('button').contains("保存").click().wait(3000);
                        });
                    }
                });
            });
        });
    });
});
