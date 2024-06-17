
Cypress.Commands.add('verifyLabel', (label, identifier) => {
    if (label) {
        let ele = identifier;
        // Checking if Id and Class are added in Identifier
        if (ele.startsWith('.') || ele.startsWith('#')) {
            ele = ele.substring(1);
        }
        cy.get(`[for="${ele}"]`).should("have.text", label).as('label');
    } else {
        cy.log("Label not provided");
    }

});
Cypress.Commands.add("typeText", (inputTexts) => {
    inputTexts.forEach(inputText => {
        const [identifier, text, clear, label] = inputText;
        if (inputText[1]) {
            cy.verifyLabel(label, identifier)
            // chaining .as('alias') to the element for assertion to reference later with cy.get('@alias')
            cy.wait(200)
            cy.get(identifier).scrollIntoView().as('TextInputField').should("be.visible");

            if (clear === 1) {
                cy.get('@TextInputField').clear().type(text);
            } else if (clear === 0 || clear === undefined) {
                cy.get('@TextInputField').type(text);
            } else {
                cy.log("To clear previous text, type 1, else type 0");
            }
        } else {
            cy.log(`${identifier} has no value in Spreadsheet`);

        }
    });
});

Cypress.Commands.add('dropdown', (dropdownValues) => {
    dropdownValues.forEach(dropdownValue => {
        const [identifier, value, label] = dropdownValue;
        if (dropdownValue[1]) {
            cy.verifyLabel(label, identifier)
            cy.get(identifier).scrollIntoView().as('dropdownField').should("be.visible");
            cy.get('@dropdownField').select(value, { force: true });
        }
    })

});

Cypress.Commands.add('fileUpload', (fileLinks) => {
    fileLinks.forEach(fileLink => {
        const [identifier, value, label] = fileLink;
        cy.verifyLabel(label, identifier)
        cy.get(identifier).as('fileupload').should("not.be.visible");
        cy.get('@fileupload').selectFile(value, { force: true });
    })

});

Cypress.Commands.add('clubLogin', (env, username, password) => {
    cy.visit(Cypress.env(env).clubUrl);
    cy.typeText([
        ['[name="LoginId"]', username, 1, ''],
        ['[name="password"]', password, 1, ''],
    ]);

    cy.get('button').contains('ログイン').should('be.visible').click();
    cy.url().should('not.include', '/auth/login');


});


Cypress.Commands.add('approveClub', (env, tableData) => {
    cy.adminLogin(env)
    cy.visit(Cypress.env(env).adminUrl + '/ClubManagement/ClubList')
    cy.get('#tab2Link').click()
    cy.get('#default-search-pending').type(`${tableData.clubNameEng}{enter}`)
    cy.get('#table-id > tbody svg').eq(0).click()
})

Cypress.Commands.add('setClubCreds', (env, tableData) => {

    cy.adminLogin(env)
    cy.visit(Cypress.env(env).adminUrl + '/EmailLog')
    cy.get('tbody td').eq(2).then(e => {
        const Email = e[0].innerText;

        let uNameRegex = /ユーザー名：([^\s]+)/;
        let passwordRegex = /パスワード：([^\s]+)/;

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

Cypress.Commands.add('clubManagement', (env, clubName, action) => {
    cy.adminLogin(env);
    cy.visit(Cypress.env(env).adminUrl + '/ClubManagement/ClubList');
    cy.get('#default-search').type(`${clubName}{enter}`).wait(1000);

    switch (action) {
        case 1:
            // Edit action
            cy.get('.la-edit').click().wait(1000);
            break;
        case 2:
            // Manager setting action
            cy.get('[src="/Content/assets/images/manager-setting.svg"]').click().wait(1000);
            break;
        case 3:
            // Tag action
            cy.get('.la-tag').click().wait(1000);
            break;
        case 4:
            // Delete action
            cy.get('.la-trash-alt').click().wait(1000);
            break;
        case 5:
            // Key action
            cy.get('.la-key').click().wait(1000);
            break;
        case 6:
            // Notice action
            cy.get('[src="/Content/assets/images/notice.svg"]').click().wait(1000);
            break;
        case 7:
            // User action
            cy.get('.la-user').click().wait(1000);
            break;
        case 8:
            // Calendar check action
            cy.get('.la-calendar-check').click().wait(1000);
            break;
        case 9:
            // Schedule action
            cy.get('[src="/Content/assets/images/schedule.svg"]').click().wait(1000);
            break;
        case 10:
            // Other action
            cy.get('a > .las').click().wait(1000);
            break;
        default:
            // No action or invalid action
            cy.log('No valid action provided');
    }
});

Cypress.Commands.add('getClubUserName', (env, clubName) => {
    cy.clubManagement(env, clubName, 1);
    cy.get('[name="LoginId"]').invoke('val').then(username => {
        cy.log(username);
        cy.wrap(username).as('clubUsername');  // Store the username as an alias
        cy.get('.flex > .resetForm').click();
    });
});

Cypress.Commands.add('storeCreds', (env, userName, newPassword, clubData) => {
    let writeData = {
        userName,
        password: newPassword,
        clubName: clubData.clubNameEng,
        clubNameKatakana: clubData.clubNameKatakana
    }
    cy.writeFile(`cypress/fixtures/club_creds/${env}/${env} ${userName}.json`, writeData);
})


Cypress.Commands.add('resetClubPassword', (env, clubName, newPassword) => {

    cy.getClubUserName(env, clubName)


    cy.clubManagement(env, clubName, 5)
    cy.get('#reset_customer_id').click().wait(500)
    cy.visit(Cypress.env(env).adminUrl + '/SMSLog')
    cy.get('tbody td').eq(2).then(e => {
        const sms = e[0].innerText;

        let passwordRegex = /Your password is ([^\s]+)/;

        let passwordMatch = sms.match(passwordRegex);

        let password = passwordMatch ? passwordMatch[1] : "Password not found";
        cy.get('@clubUsername').then(userName => {
            cy.clubLogin(env, userName, password)

            cy.setNewPassword(newPassword)
            cy.storeCreds(env, userName, newPassword, "")
            cy.clubLogin(env, userName, newPassword)
        })
    });
})

Cypress.Commands.add('setNewPassword', (password) => {
    cy.typeText([
        ['[data-e2e="newPassword"]', password, 1, ''],
        ['[data-e2e="confirmPassword"]', password, 1, ''],
    ]);

    cy.get('button').contains('続行').should("be.visible").click().wait(1000);
})



Cypress.Commands.add("clubRegPage1", (tableData) => {

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

    cy.get('[type="file"]').eq(0).selectFile(`${tableData.businessFileLocation}`, { force: true }).wait(1000)
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
    cy.get('button').contains('契約者情報の入力へ').should("be.visible").click().wait(500)
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

Cypress.Commands.add("clubDetailsUpdate", (tableData) => {
    cy.wait(3000).get('.chakra-text').contains(`${tableData.holiday}`).click({ force: true })

    cy.changeClubLogoAndBanner(tableData)
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


    cy.writeHostClubDescription(tableData, '[name="description"]', `${tableData.description}`)

    cy.dropdown([
        ['[name="workingHoursFrom"]', `${tableData.workingHoursFrom}`, ''],
        ['[name="workingHourTo"]', `${tableData.workingHoursTo}`, ''],
        ['[name="lastEntryTime"]', `${tableData.lastEntryTime}`, ''],
        ['[name="lastOrderTime"]', `${tableData.lastOrderTime}`, ''],

        ['[name="closingDate"]', `${tableData.closingDate}`, ''],

    ])
    cy.get('[data-e2e="release"]').click().wait(1000)

})



Cypress.Commands.add('writeHostClubDescription', (values, outputSelector, description) => {
    // let description = hostClubDescriptionTemplate;

    // Replace placeholders with actual values
    for (const key in values) {
        const placeholder = `{{${key}}}`;
        description = description.replace(new RegExp(placeholder, 'g'), values[key]);
    }

    // Write the description to the specified output location
    cy.get(outputSelector).clear().type(description);
});

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
            cy.get('.chakra-button').click().wait(2000)

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

Cypress.Commands.add('getFolderContents', (folderPath) => {
    cy.task('readFolder', folderPath).then((result) => {
        if (result.error) {
            cy.log(`Error: ${result.error}`);
        } else {
            return result.files
        }
    });
});








