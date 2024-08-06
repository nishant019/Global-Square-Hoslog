Cypress.Commands.add('clubLogin', (env, username, password) => {
    cy.visit(Cypress.env(env).clubUrl);
    cy.typeText([
        ['[name="LoginId"]', username, 1, ''],
        ['[name="password"]', password, 1, ''],
    ]);

    cy.get('button').contains('ログイン').should('be.visible').click();
    cy.url().should('not.include', '/auth/login');
});

Cypress.Commands.add('setNewPassword', (password) => {
    cy.typeText([
        ['[data-e2e="newPassword"]', password, 1, ''],
        ['[data-e2e="confirmPassword"]', password, 1, ''],
    ]);

    cy.get('button').contains('続行').should("be.visible").click().wait(1000);
})

Cypress.Commands.add("clubRegPage1", (tableData) => {
    cy.get('button').contains('内容理解した上で前に進む').click().wait(1000)

    cy.typeText([
        ['[data-e2e="clubName"]', `${tableData.clubNameEng}`, 1, ''],
        ['[data-e2e="ClubNameKatakana"]', `${tableData.clubNameKatakana}`, 1, ''],
        ['[data-e2e="English"]', `${tableData.english}`, 1, ''],
        ['[data-e2e="GroupName"]', `${tableData.groupName}`, 1, ''],
        ['[data-e2e="postalcode"]', `${tableData.postalCode}`, 1, ''],
        ['[data-e2e="City"]', `${tableData.city}`, 1, ''],
        ['[data-e2e="Street"]', `${tableData.street}`, 1, ''],
        ['[data-e2e="BuildingRoomNo"]', `${tableData.buildingRoomNumber}`, 1, ''],
        ['[data-e2e="LandlineNumber"]', `${tableData.landlineNumber}`, 1, ''],
    ]);
    cy.dropdown([
        ['[name="LocationId"]', `${tableData.location}`, ''],
    ])

})

Cypress.Commands.add("clubRegPage2", (tableData) => {
    if (`${tableData.businessType}` === 'co') {
        cy.get('[name="BusinessType"]').eq(0).check({ force: true }).wait(500)

        cy.typeText([
            ['[data-e2e="CompanyName"]', `${tableData.companyName}`, 1, ''],
            ['[data-e2e="CompanyNameKatakana"]', `${tableData.companyNameKatakana}`, 1, '']
        ])

    } else {
        cy.get('[name="BusinessType"]').eq(1).check({ force: true })
    }

    cy.typeText([
        ['[data-e2e="CEOName"]', `${tableData.ceoName}`, 1, ''],
        ['[data-e2e="CeoNameKatakana"]', `${tableData.ceoNameKata}`, 1, ''],
        ['[data-e2e="MobileNumber"]', `${tableData.mobile}`, 1, ''],
        ['[data-e2e="Email"]', `${tableData.email}`, 1, ''],
    ])

})

Cypress.Commands.add("clubRegPage3", (tableData) => {
    cy.get('[name="DocumentType"]').select(1)

    cy.get('[type="file"]').eq(0).selectFile(`${tableData.kycFileLocation}`, { force: true }).wait(1000)
    if (tableData.businessType === 'co') {
        cy.get('[type="file"]').eq(0).selectFile(tableData.kycFileLocation, { force: true }).wait(1000);
    }
    cy.get('[type="file"]').eq(0).selectFile(`${tableData.idFrontFileLocation}`, { force: true }).wait(1000)
    cy.get('[type="file"]').eq(0).selectFile(`${tableData.idBackFileLocation}`, { force: true }).wait(1000)
})

Cypress.Commands.add("clubRegistration", (tableData) => {

    cy.clubRegPage1(tableData)
    cy.get('button').contains('契約者情報の入力へ').should("be.visible").click().wait(500)

    cy.clubRegPage2(tableData)
    cy.get('button').contains('本人確認書類のアップロードへ').should("be.visible").click().wait(500)

    cy.clubRegPage3(tableData)
    cy.get('button').contains('ホスログへの店舗掲載を申請する').should("be.visible").click().wait(2000)

    //Success Page Buttton
    cy.get('button').contains('続けて別の店舗掲載を申請する').should("be.visible").click().wait(500)
})

Cypress.Commands.add('setClubCreds', (env, tableData) => {

    cy.adminLogin(env)
    cy.visit(Cypress.env(env).adminUrl + '/EmailLog')
    cy.get('tbody td').eq(2).then(e => {
        const Email = e[0].innerText;

        let uNameRegex = /店舗ID：([^\s]+)/;
        let passwordRegex = /仮パスワード：([^\s]+)/;
        let usernameMatch = Email.match(uNameRegex);
        let passwordMatch = Email.match(passwordRegex);

        let username = usernameMatch ? usernameMatch[1] : "Username not found";
        let password = passwordMatch ? passwordMatch[1] : "Password not found";

        cy.clubLogin(env, username, password)

        cy.setNewPassword(tableData.password)
        cy.storeCreds(env, username, tableData.password, tableData)


        cy.clubLogin(env, username, tableData.password)

    });
})

Cypress.Commands.add("clubDetailsUpdate", (tableData) => {
    cy.wait(3000).get('.chakra-text').contains(`${tableData.holiday}`).click({ force: true })

    // cy.changeClubLogoAndBanner(tableData)
    cy.typeText([
        // ['[name="storeNameEng"]', `${tableData.clubNameEng}`, 1, ''],
        // ['[name="storeNameKatakana"]', `${tableData.clubNameKatakana}`, 1, ''],
        // ['[name="groupName"]', `${tableData.groupName}`, 1, ''],
        ['[name="googleMapLink"]', `${tableData.googleMap}`, 1, ''],
        ['[name="instagramLink"]', `${tableData.instagram}`, 1, ''],
        ['[name="tiktokLink"]', `${tableData.tiktok}`, 1, ''],
        ['[name="twitterLink"]', `${tableData.x}`, 1, ''],
        ['[name="line"]', `${tableData.line}`, 1, ''],
        ['[name="websiteLink"]', `${tableData.website}`, 1, ''],
        ['[name="facebookLink"]', `${tableData.facebook}`, 1, ''],

        ['[name="regularFee"]', `${tableData.regularFee}`, 1, ''],
        ['[name="designationFee"]', `${tableData.designationFee}`, 1, ''],
        ['[name="companionFee"]', `${tableData.companionFee}`, 1, ''],
        ['[name="extensionFee"]', `${tableData.extensionFee}`, 1, ''],
        ['[name="drinksFee"]', `${tableData.drinksFee}`, 1, ''],
        ['[name="tax"]', `${tableData.tax}`, 1, ''],


    ]);
    const description = "ついに「{{clubNameEng}}」が登場しました☆ 説明は不要です！このプロフェッショナル集団は、熟練のホストから若きカリスマまで、多彩な才能が揃っています。彼らの高い接客スキルは、一度体験する価値がありますよ！"

    cy.writeHostClubDescription(tableData, '[name="description"]', `${description}`)

    cy.dropdown([
        ['[name="workingHoursFrom"]', `${tableData.workingHoursFrom}`, ''],
        ['[name="workingHourTo"]', `${tableData.workingHoursTo}`, ''],
        ['[name="lastEntryTime"]', `${tableData.lastEntryTime}`, ''],
        ['[name="lastOrderTime"]', `${tableData.lastOrderTime}`, ''],

        ['[name="closingDate"]', `${tableData.closingDate}`, ''],

    ])
    cy.get('[data-e2e="release"]').click().wait(1000)

})

Cypress.Commands.add("setClubDetails", (tableData) => {
    cy.get('button').contains('続行').should("be.visible").click().wait(1000);
    cy.clubDetailsUpdate(tableData)
})

Cypress.Commands.add("changeClubLogoAndBanner", (tableData) => {
    //remove Previous Image
    cy.get('circle').eq(0).click({ force: true }).wait(1000)
    cy.get('circle').eq(0).click({ force: true }).wait(1000)

    cy.get("[type='file']").eq(0).selectFile(`${tableData.clubBanner}`, { force: true }).wait(1000)
    cy.get('[data-e2e="save"]').click().wait(1000)

    cy.get("[type='file']").eq(0).selectFile(`${tableData.clubLogo}`, { force: true }).wait(1000)
    cy.get('[data-e2e="save"]').click().wait(1000)
})

Cypress.Commands.add("uploadGallery", (env, imageLocation, fileName) => {
    cy.visit(Cypress.env(env).clubUrl + '/media').wait(3000);

    // Check for folder name; if it doesn't exist, create the folder
    cy.get('body').then($body => {
        const elementsContainingText = $body.find('*').filter((index, element) => {
            return Cypress.$(element).text().includes(fileName);
        });

        if (elementsContainingText.length > 0) {
            // Folder exists; navigate to it
            cy.get('.css-tjq8tt').contains(fileName).click();
            cy.get('.css-pcwo9u').contains(fileName).click();
        } else {
            // Folder doesn't exist; create it
            cy.log(`No elements found with text "${fileName}"`);

            cy.get('.css-wuwme8').click();
            cy.typeText([
                ['[name="FolderName"]', fileName, 0, ''],
                ['[name="LabelName"]', fileName, 0, '']
            ]);
            cy.get('button').contains("追加").click().wait(1000);

            cy.visit(Cypress.env(env).clubUrl + '/media').wait(2000);

            // cy.dropdown([
            //     ['[name="selectFolder"]', fileName, 0, ''],
            //     ['[name="selectLabel"]', fileName, 0, ''],

            // ])

            // cy.get('button').contains("追加").click().wait(1000);
            cy.get('.css-tjq8tt').contains(fileName).click();
            cy.get('.css-pcwo9u').contains(fileName).click();
            cy.get('.chakra-button').eq(0).click().wait(2000)

        }

        //         // Upload gallery images
        cy.getFolderContents(imageLocation).then((files) => {
            if (files) {
                files.forEach(file => {

                    const fullImgLoc = imageLocation + '/' + file
                    cy.get('[type="file"]').eq(0).selectFile(fullImgLoc, { force: true }).wait(1000);
                    cy.typeText([
                        ['[name="titleImage"]', Cypress._.random(99999999999, 9999999999999999).toString(), 0, ''],
                    ]);
                    cy.get('button').contains("保存").click().wait(3000);
                })

            }
        });



    });

})


