
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