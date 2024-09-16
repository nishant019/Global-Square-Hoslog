Cypress.Commands.add('storeCreds', (env, userName, newPassword, clubData) => {
    let writeData = {
        userName,
        password: newPassword,
        clubName: clubData.clubNameEng,
        clubNameKatakana: clubData.clubNameKatakana
    }
    cy.writeFile(`cypress/fixtures/club_creds/${env}/${env} ${userName}.json`, writeData);
})

Cypress.Commands.add('writeHostClubDescription', (values, outputSelector, description) => {

    for (const key in values) {
        const placeholder = `{{${key}}}`;
        description = description.replace(new RegExp(placeholder, 'g'), values[key]);
    }
    cy.get(outputSelector).eq(1).clear().type(description,{force: true});
});

//creating image path for club and host gallery management
Cypress.Commands.add("CreateImagePath", (galleryPath) => {

    cy.task('readFolder', galleryPath).then((result) => {
        if (result.error) {
            cy.task('createFolder', galleryPath).then((createResult) => {
                if (createResult.error) {
                    cy.log(`Error: ${createResult.error}`);
                } else {
                    cy.log(`Folder created: ${galleryPath}`);
                }
            });
        } else {
            return result.files;
        }
    });




})

//getting folder contents
Cypress.Commands.add('getFolderContents', (folderPath) => {
    cy.task('readFolder', folderPath).then((result) => {
        if (result.error) {
            cy.log(`Error: ${result.error}`);
        } else {
            return result.files
        }
    });
});

Cypress.Commands.add("galleryPopup", (clubData, loginData, fileName, imageTitle) => {
    clubData.slice(0, 1).forEach(club => {
        const imageLocation = `${club.gallery}/${loginData.clubName}/Gallery`;

        cy.get('body').then($body => {
            const elementsContainingText = $body.find('*').filter((index, element) => {
                return Cypress.$(element).text().includes(fileName);
            });
            if (elementsContainingText.length == 0) {
                cy.get('.css-wuwme8').click()
                cy.typeText([
                    ['[name="FolderName"]', fileName, 0, ''],
                    ['[name="LabelName"]', fileName, 0, '']
                ]);

                cy.get('button').contains("追加").click().wait(1000);
            }

            // if (elementsContainingText.length > 0) {
            cy.intercept('POST', '/club/GalleryManagement/GetGalleryImageList').as('getSpecificEndpoint');

            cy.get('.css-tjq8tt').contains(fileName).click();
            cy.get('.css-pcwo9u').contains(fileName).click();

            cy.wait('@getSpecificEndpoint').then((interception) => {
                const responseBody = interception.response.body;
                expect(responseBody).to.have.property('data');
                const bodyData = responseBody.data;
                let titleFound = false;

                for (let index = 0; index < bodyData.length; index++) {
                    const data = bodyData[index];
                    if (data.title.toLowerCase() === imageTitle.toLowerCase()) {
                        titleFound = true;
                        cy.get('.css-6s0tmr').eq(index).click()
                        cy.get('.css-wjnxbe > .css-145ers9').click().wait(3500)
                        cy.get('.css-110w11r > .chakra-button').click().wait(500)
                        break; // Exit the loop when title matches
                    }
                }

                if (!titleFound) {
                    cy.get('.css-17al36m > .chakra-button').click();
                    cy.get('[type="file"]').eq(0).selectFile(`${imageLocation}/${file}`, { force: true }).wait(2000);
                    cy.get('[name="titleImage"]').clear().type(imageTitle.toLowerCase());
                    cy.get('.css-wjnxbe > .css-145ers9').click().wait(3000);
                    cy.get('.css-6s0tmr').last().click()
                    cy.get('.css-wjnxbe > .css-145ers9').click().wait(3500)
                    cy.get('.css-110w11r > .chakra-button').click().wait(500)

                }
            });
            // } 
            // else {
            //     cy.log("Add Folder & Label")
            //     cy.get('.css-wuwme8').click()
            //     cy.typeText([
            //         ['[name="FolderName"]', fileName, 0, ''],
            //         ['[name="LabelName"]', fileName, 0, '']
            //     ]);
            //     cy.get('button').contains("追加").click().wait(1000);
            //     cy.get('.css-17al36m > .chakra-button').click();
            //     cy.get('[type="file"]').eq(0).selectFile(`${imageLocation}/${file}`, { force: true }).wait(2000);
            //     cy.get('[name="titleImage"]').clear().type(imageTitle);
            //     cy.get('.css-wjnxbe > .css-145ers9').click().wait(3000);
            //     cy.get('.css-6s0tmr').last().click()
            //     cy.get('.css-wjnxbe > .css-145ers9').click().wait(3500)
            //     cy.get('.css-110w11r > .chakra-button').click().wait(500)
            // }
        });



    });
})








