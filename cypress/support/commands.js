const path = require('path');
const fs = require('fs')
import('./admin/custom_commands')
import('./club/custom_commands')
import('./club/registration_commands') 
import('./external_commands/ext_commands')

Cypress.on('uncaught:exception', (err, runnable) => {
    return false
});

Cypress.Commands.add("clearCacheData", () => {
    // Clear cookies
    cy.clearCookies();
    
    // Clear local storage
    cy.window().then((win) => {
        win.localStorage.clear();
    });
    
    // Clear session storage
    cy.window().then((win) => {
        win.sessionStorage.clear();
    });
    
    // You can also clear specific caches if you know the keys
    cy.window().then((win) => {
        win.indexedDB.databases().then((databases) => {
            databases.forEach((db) => {
                win.indexedDB.deleteDatabase(db.name);
            });
        });
    });
})

Cypress.Commands.add("readXlsx", (inputFile) => {
    return cy.task('readXlsx', { filePath: inputFile })
});

Cypress.Commands.add("readXlsx", (inputFile, sheetName, startIndex,maxRow  ) => {
    return cy.task('readXlsx', {
        file: `cypress/fixtures/${inputFile}.xlsx`,
        sheet: sheetName
    }).then((rows) => {
        let maxRows = maxRow > 0 ? maxRow : rows.length;
        // Adjust startIndex if it's out of bounds
        if (startIndex < 0) startIndex = 0;
        if (startIndex >= rows.length) startIndex = rows.length - 1;

        // Adjust maxRows if it exceeds available rows from the startIndex
        if ((startIndex + maxRows) > rows.length) {
            maxRows = rows.length - startIndex;
        }

        return rows.slice(startIndex, startIndex + maxRows);
    });
});

Cypress.Commands.add('checkTextWithAttributes', (filename) => {
    let results = [];

    // Read data from Excel file
    return cy.readXlsx(`Text Validations/${filename}`).then(rows => {
        const values = rows.rows;

        // Mapping each value to a Cypress command
        const commands = values.map(row => {
            const { element, type, value, field } = row;
            const elementName = getElementName(element);

            if (type === 'innerText') {
                return cy.get(element).then(el => {
                    checkInnerText(el, type, value, results, elementName, field, filename);
                });
            } else {
                return cy.get(element).then(el => {
                    checkAttribute(el, type, value, results, elementName, field, filename);
                });
            }
        });

        // Returning a Cypress command directly
        return cy.wrap(null).then(() => {
            // Using Promise.all to execute all commands concurrently
            return Promise.all(commands).then(() => {
                // After all checks are done, create test results HTML
                cy.createTestResultsHTML(results, filename);
            });
        });
    });
});

Cypress.Commands.add('highlightElement', { prevSubject: true }, ($element) => {
    cy.wrap($element).should('be.visible').then(($el) => {
        const highlightStyle = 'outline: 2px solid red;'; // Adjust the style as needed
        $el[0].setAttribute('style', highlightStyle);
    });
});

function checkInnerText(element, attr, text, results, elementName, field, fixtureFileName) {
    const subjectText = Cypress.$(element).text().replace(/\s+/g, '').trim();
    const result = subjectText.includes(text.replace(/\s+/g, '').trim()) ? 'passed' : 'failed';
    results.push({ elementSelector: elementName, result, value: text, field, type: attr });

    if (result === 'failed') {
        cy.get(element).highlightElement().then(() => {
            cy.screenshot(`${fixtureFileName}/${fixtureFileName}`)
        });
    }
}

function checkAttribute(element, attr, value, results, elementName, field, fixtureFileName) {
    return cy.get(element).invoke('attr', attr).then(attributeValue => {
        const result = attributeValue.replace(/\s+/g, '').trim() === value.replace(/\s+/g, '').trim() ? 'passed' : 'failed';
        results.push({ elementSelector: elementName, result, value, field, type: attr });

        if (result === 'failed') {
            cy.get(element).highlightElement().then(() => {
                cy.screenshot(`${fixtureFileName}/${fixtureFileName}`)
            });
        }
    });
}



function getElementName(element) {
    // Logic to get element name based on selector
    return element; // Replace with actual logic
}

Cypress.Commands.add('createTestResultsHTML', (testResults, filename) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Results</title>
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 8px;
                    border-bottom: 1px solid #ddd;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                tr.failed {
                    background-color: #FA8072;
                }
                .passed {
                    color: green;
                }
                .failed {
                    color: white;
                }
            </style>
        </head>
        <body>

        <h2>Test Results</h2>
        <h3>${filename} Page</h3>
        <table id="results-table">
            <thead>
                <tr>
                    <th>Value</th>
                    <th>Element</th>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
                ${generateTableRows(testResults)}
            </tbody>
        </table>

        </body>
        </html>
    `;

    // Write the HTML content to a file
    cy.writeFile(`cypress/Text content results/${filename}/ ${Date.now()}.html`, htmlContent);
});

function generateTableRows(testResults) {
    return testResults.map(result => `
        <tr class="${result.result}">
            <td class="${result.result}">${result.value}</td>
            <td class="${result.result}">${result.elementSelector}</td>
            <td class="${result.result}">${result.field}</td>
            <td class="${result.result}">${result.type}</td>
            <td class="${result.result}">${result.result}</td>
        </tr>
    `).join('');
}


Cypress.Commands.add('selectDataFromDropdown', (selector, value) => {
    cy.get(selector).click();
    cy.get('.select2-dropdown').should('be.visible').contains(value).click();
});

Cypress.Commands.add('removeJapanese', (str) => {
    let result = str.replace(/[^A-Za-z0-9\s′']/g, '').trim();


    return result;
})
Cypress.Commands.add('removeSp', (str) => {

    const regex = /[^\w\s"'α\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FCF\u3400-\u4DBF\uF900-\uFAFF\u1B000-\u1B0FF\u20000-\u2A6DF]+/g;

    let result = str.replace(regex, ' ');

    result = result.replace(/\b\w/g, (char) => char.toUpperCase());

    return result;
});







Cypress.Commands.add('removeJapaneseOnly', (str) => {
    let result = str.replace(/[^A-Za-z0-9\s]/g, '').trim();


    return result;
})



// cypress/support/commands.js

Cypress.Commands.add('extractJapaneseText', (text) => {
    const japaneseRegex = /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FFF]+/g;
    const englishRegex = /[a-zA-Z]+/g;

    const japaneseMatches = text.match(japaneseRegex);
    const englishMatches = text.match(englishRegex);

    let japanese = japaneseMatches ? japaneseMatches.join(' ') : '';
    let english = englishMatches ? englishMatches.join(' ') : '';

    if (!japanese) {
        japanese = english
    } else if (!english) {
        english = japanese
    }
    return { japanese, english };
});





// cypress/support/commands.js
Cypress.Commands.add('adminLogin', (envName,adminUser,adminPassword) => {
    cy.session('login', () => {

        cy.visit(Cypress.env(envName).adminUrl)
        cy.get('#Username').type(Cypress.env(envName).adminLogin);
        cy.get('#Password').type(Cypress.env(envName).adminPassword);
        cy.get('.btn').click().wait(1000);
    })
    cy.visit(Cypress.env(envName).adminUrl)
})

Cypress.Commands.add('checkFolderContents', (folderPath) => {
    const absolutePath = path.resolve(folderPath);

    return cy.task('readFileSync', Cypress.config('projectRoot') + absolutePath);

});

Cypress.Commands.add('imageDownload', (fixture) => {
    cy.fixture(fixture).then(e => {
        e.forEach(urls => {
            const newUrl = urls.url.replace('index', 'system')
            cy.visit(newUrl, { timeout: 240000 })
            cy.get('.bd > .img > img').then((logo) => {
                const logoUrl = logo[0].src
                const clubName = logoUrl.split('/')[4]
                const filename = logoUrl.split('/')[5]
                cy.request({
                    method: 'GET',
                    url: logoUrl,
                    headers: {
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    },
                    encoding: 'binary',
                }).then((response) => {
                    // expect(response.status).to.eq(200);
                    cy.writeFile(`./${clubName}/${filename}`, response.body, 'binary');
                }).wait(1500);


            })
        })
    })
})



