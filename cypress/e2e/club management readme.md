Here is a detailed README for the Cypress script that handles the club registration from the club panel:

## Cypress Script: Club Registration From Club Panel

### Description
This Cypress script automates the process of registering a club from the club panel. It reads club data from an Excel file, visits the registration panel, fills out the registration form, approves the club, sets club credentials, and updates club details.

### Script Overview
The script consists of a test suite named "Club Registration From Club Panel" with one main test that performs the entire registration process. The script uses custom Cypress commands to handle various actions such as filling forms, uploading files, and managing club credentials.

### Prerequisites
- Cypress should be installed in your project.
- The Excel file containing club data should be available at the specified path.

### Custom Cypress Commands Used
1. `cy.verifyLabel`
2. `cy.typeText`
3. `cy.dropdown`
4. `cy.fileUpload`
5. `cy.clubLogin`
6. `cy.approveClub`
7. `cy.setClubCreds`
8. `cy.clubManagement`
9. `cy.getClubUserName`
10. `cy.storeCreds`
11. `cy.resetClubPassword`
12. `cy.setNewPassword`
13. `cy.clubRegPage1`
14. `cy.clubRegPage2`
15. `cy.clubRegPage3`
16. `cy.clubRegistration`
17. `cy.setClubDetails`
18. `cy.changeClubLogoAndBanner`
19. `cy.clubDetailsUpdate`
20. `cy.writeHostClubDescription`

### Test Suite: Club Registration From Club Panel

#### Test Suite Setup
```javascript
describe("Club Registration From Club Panel", () => {
    const env = 'uat'

    // Delete Club before test (if necessary)
    before(() => {
        // Uncomment the line below to delete the club before running the test
        // cy.clubManagement(env, 'moment', 4)
    })
```

#### Main Test: Visits Registration Panel and Fills the Form
```javascript
    it("Visits Registration Panel and fills the form", () => {
        cy.readXlsx('Excel Files/Club Data/ClubData', 'Sheet1', 7).then(data => {
            cy.visit(Cypress.env(env).clubUrl + '/auth/register')
            data.forEach(tableData => {
                cy.clubRegistration(tableData)
                cy.approveClub(env, tableData)
                cy.setClubCreds(env, tableData)
                cy.setClubDetails(tableData).wait(3000)
                cy.clearCacheData()
            })
        })
    })
})
```

### Detailed Explanation of Each Step

1. **Reading Excel Data**:
   The script reads data from an Excel file named `ClubData` located in the `Excel Files/Club Data` directory. It reads data from `Sheet1` and processes 7 rows.
   ```javascript
   cy.readXlsx('Excel Files/Club Data/ClubData', 'Sheet1', 7).then(data => {
   ```

2. **Visiting Registration Panel**:
   The script visits the club registration URL.
   ```javascript
   cy.visit(Cypress.env(env).clubUrl + '/auth/register')
   ```

3. **Processing Each Club Data**:
   For each club data entry, the script performs the following actions:
   - **Club Registration**: Fills out the club registration form.
     ```javascript
     cy.clubRegistration(tableData)
     ```

   - **Approve Club**: Approves the club in the admin panel.
     ```javascript
     cy.approveClub(env, tableData)
     ```

   - **Set Club Credentials**: Sets and stores the club credentials.
     ```javascript
     cy.setClubCreds(env, tableData)
     ```

   - **Set Club Details**: Updates various club details and waits for 3 seconds.
     ```javascript
     cy.setClubDetails(tableData).wait(3000)
     ```

   - **Clear Cache Data**: Clears cache data to ensure fresh state for next iteration.
     ```javascript
     cy.clearCacheData()
     ```

### Running the Script
To run this script, execute the following command in your terminal:
```bash
npx cypress open
```
Then, select the test file containing this script to run it.

### Notes
- Ensure the Excel file path and sheet name are correct.
- Uncomment the line in the `before` hook if you need to delete the club before running the test.
- Modify the `env` variable as needed (e.g., 'uat', 'production').

This README provides a comprehensive guide to understand and execute the Cypress script for club registration from the club panel.