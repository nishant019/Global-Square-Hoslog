
# 📊 Cypress Excel Integration Guide

This guide explains how to **read Excel (`.xlsx`) files as test data** inside Cypress tests using `node-xlsx` and custom task integration.

---

## 📦 Step 1: Install Dependencies

Run the following commands in your Cypress project:

```bash
npm install node-xlsx
npm install jsonpath
npm install xlsx
```

---

## 🔧 Step 2: Update `cypress.config.js`

Add the following content to the top of `cypress.config.js`:

```js
const xlsx = require('node-xlsx').default;
const fs = require('fs');
const path = require('path');
const readXlsx = require('./read-xlsx');
```

Then, inside the `setupNodeEvents(on, config)` function, add:

```js
on('task', {
  parseXlsx({ filePath }) {
    return new Promise((resolve, reject) => {
      try {
        const jsonData = xlsx.parse(fs.readFileSync(filePath));
        resolve(jsonData);
      } catch (e) {
        reject(e);
      }
    });
  },
  'readXlsx': readXlsx.read
});
```

---

## 📁 Step 3: Create `read-xlsx.js` (Project Root)

Create a file named `read-xlsx.js` (same folder as `cypress.config.js`) with the following content:

```js
const fs = require('fs');
const XLSX = require('xlsx');

const read = ({ file, sheet }) => {
  const buf = fs.readFileSync(file);
  const workbook = XLSX.read(buf, { type: 'buffer' });
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { defval: "" });
  return rows;
};

module.exports = { read };
```

---

## 🧩 Step 4: Add Custom Command

In `cypress/support/commands.js`, add this command:

```js
Cypress.Commands.add("readXlsx", (inputFile, sheetName) => {
  return cy.task('readXlsx', {
    file: `cypress/fixtures/${inputFile}.xlsx`,
    sheet: sheetName
  }).then((rows) => {
    return rows;
  });
});
```

---

## 📂 Step 5: Add Excel File

Place your Excel file (e.g., `test.xlsx`) in the `cypress/fixtures/` folder.

---

## ✅ Step 6: Use Excel Data in Tests

In your test spec file:

```js
let rowsLength;

before(() => {
  cy.task('readXlsx', {
    file: "cypress/fixtures/test.xlsx",
    sheet: "Sheet1"
  }).then((rows) => {
    rowsLength = rows.length;
    cy.writeFile("cypress/fixtures/test.json", { rows });
  });
});

it('Read and use Excel data', () => {
  cy.readXlsx("test", "Sheet1").then(data => {
    data.forEach(row => {
      console.log("Excel Row:", row);
      // Example: use row.name, row.email, etc.
    });
  });
});
```

---

## 📝 Notes

- The `.xlsx` file must be inside the `cypress/fixtures/` folder.
- Use `Sheet1`, `Sheet2`, etc., based on the actual sheet name.
- All fields from Excel will be returned as key-value pairs per row.

---

Happy testing! ✅
