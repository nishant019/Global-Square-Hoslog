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
    cy.get(outputSelector).clear().type(description);
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








