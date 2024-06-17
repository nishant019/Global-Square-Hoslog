Here is an explanation of the Cypress commands you provided, including parameters and values passed in, along with examples:

### cy.verifyLabel
**Parameters:** `label`, `identifier`
**Description:** Verifies if a label element with a "for" attribute matching the `identifier` has the text `label`.
**Example:**
```javascript
cy.verifyLabel('Username', '#username');
```

### cy.typeText
**Parameters:** `inputTexts`
**Description:** Types text into input fields. Supports optional clearing of previous text and verifying associated labels.
**Example:**
```javascript
cy.typeText([
    ['#username', 'testUser', 1, 'Username'],
    ['#password', 'testPassword', 0, 'Password']
]);
```

### cy.dropdown
**Parameters:** `dropdownValues`
**Description:** Selects values from dropdown elements, verifying associated labels if provided.
**Example:**
```javascript
cy.dropdown([
    ['#country', 'Japan', 'Country']
]);
```

### cy.fileUpload
**Parameters:** `fileLinks`
**Description:** Uploads files to specified file input fields, verifying associated labels if provided.
**Example:**
```javascript
cy.fileUpload([
    ['#profilePic', 'cypress/fixtures/profile.jpg', 'Profile Picture']
]);
```

### cy.clubLogin
**Parameters:** `env`, `username`, `password`
**Description:** Logs into the club website using the provided environment, username, and password.
**Example:**
```javascript
cy.clubLogin('production', 'admin', 'adminPassword');
```

### cy.approveClub
**Parameters:** `env`, `tableData`
**Description:** Approves a club in the admin interface, searching for the club by name from `tableData`.
**Example:**
```javascript
cy.approveClub('production', { clubNameEng: 'Test Club' });
```

### cy.setClubCreds
**Parameters:** `env`, `tableData`
**Description:** Sets credentials for a club by extracting them from email logs and storing them in a file.
**Example:**
```javascript
cy.setClubCreds('production', { password: 'newPassword', clubNameEng: 'Test Club', clubNameKatakana: 'テストクラブ' });
```

### cy.clubManagement
**Parameters:** `env`, `clubName`, `action`
**Description:** Performs different actions (like edit, delete) on a club in the admin interface.
**Example:**
```javascript
cy.clubManagement('production', 'Test Club', 1); // Edit action
```

### cy.getClubUserName
**Parameters:** `env`, `clubName`
**Description:** Retrieves the username of a club and stores it as an alias for later use.
**Example:**
```javascript
cy.getClubUserName('production', 'Test Club');
```

### cy.storeCreds
**Parameters:** `env`, `userName`, `newPassword`, `clubData`
**Description:** Stores club credentials in a JSON file.
**Example:**
```javascript
cy.storeCreds('production', 'testUser', 'newPassword', { clubNameEng: 'Test Club', clubNameKatakana: 'テストクラブ' });
```

### cy.resetClubPassword
**Parameters:** `env`, `clubName`, `newPassword`
**Description:** Resets the club password and stores the new credentials.
**Example:**
```javascript
cy.resetClubPassword('production', 'Test Club', 'newPassword');
```

### cy.setNewPassword
**Parameters:** `password`
**Description:** Sets a new password in the password fields.
**Example:**
```javascript
cy.setNewPassword('newPassword');
```

### cy.clubRegPage1
**Parameters:** `tableData`
**Description:** Fills out the first page of the club registration form with data from `tableData`.
**Example:**
```javascript
cy.clubRegPage1({
    clubNameEng: 'Test Club',
    clubNameKatakana: 'テストクラブ',
    english: 'Yes',
    groupName: 'Test Group',
    postalCode: '1234567',
    city: 'Tokyo',
    street: 'Shinjuku',
    buildingRoomNumber: '101',
    landlineNumber: '0312345678',
    location: 'Tokyo'
});
```

### cy.clubRegPage2
**Parameters:** `tableData`
**Description:** Fills out the second page of the club registration form with data from `tableData`.
**Example:**
```javascript
cy.clubRegPage2({
    businessType: 'co',
    companyName: 'Test Company',
    companyNameKatakana: 'テストカンパニー',
    ceoName: 'Test CEO',
    ceoNameKata: 'テストCEO',
    mobile: '09012345678',
    email: 'test@example.com'
});
```

### cy.clubRegPage3
**Parameters:** `tableData`
**Description:** Fills out the third page of the club registration form with data from `tableData`.
**Example:**
```javascript
cy.clubRegPage3({
    businessFileLocation: 'cypress/fixtures/business.pdf',
    kycFileLocation: 'cypress/fixtures/kyc.pdf',
    idFrontFileLocation: 'cypress/fixtures/id_front.pdf',
    idBackFileLocation: 'cypress/fixtures/id_back.pdf'
});
```

### cy.clubRegistration
**Parameters:** `tableData`
**Description:** Completes the club registration process using data from `tableData`.
**Example:**
```javascript
cy.clubRegistration({
    clubNameEng: 'Test Club',
    clubNameKatakana: 'テストクラブ',
    english: 'Yes',
    groupName: 'Test Group',
    postalCode: '1234567',
    city: 'Tokyo',
    street: 'Shinjuku',
    buildingRoomNumber: '101',
    landlineNumber: '0312345678',
    location: 'Tokyo',
    businessType: 'co',
    companyName: 'Test Company',
    companyNameKatakana: 'テストカンパニー',
    ceoName: 'Test CEO',
    ceoNameKata: 'テストCEO',
    mobile: '09012345678',
    email: 'test@example.com',
    businessFileLocation: 'cypress/fixtures/business.pdf',
    kycFileLocation: 'cypress/fixtures/kyc.pdf',
    idFrontFileLocation: 'cypress/fixtures/id_front.pdf',
    idBackFileLocation: 'cypress/fixtures/id_back.pdf'
});
```

### cy.setClubDetails
**Parameters:** `tableData`
**Description:** Sets various club details after registration using data from `tableData`.
**Example:**
```javascript
cy.setClubDetails({
    googleMap: 'https://maps.google.com',
    instagram: 'https://instagram.com/test',
    tiktok: 'https://tiktok.com/@test',
    x: 'https://twitter.com/test',
    line: 'https://line.me/test',
    website: 'https://test.com',
    facebook: 'https://facebook.com/test',
    regularFee: '1000',
    designationFee: '2000',
    companionFee: '3000',
    extensionFee: '4000',
    drinksFee: '500',
    tax: '10',
    description: 'Test club description.',
    workingHoursFrom: '18:00',
    workingHoursTo: '02:00',
    lastEntryTime: '01:00',
    lastOrderTime: '01:30',
    closingDate: 'Monday',
    clubBanner: 'cypress/fixtures/banner.jpg',
    clubLogo: 'cypress/fixtures/logo.jpg'
});
```

### cy.changeClubLogoAndBanner
**Parameters:** `tableData`
**Description:** Changes the club logo and banner using file paths provided in `tableData`.
**Example:**
```javascript
cy.changeClubLogoAndBanner({
    clubBanner: 'cypress/fixtures/banner.jpg',
    clubLogo: 'cypress/fixtures/logo.jpg'
});
```

### cy.clubDetailsUpdate
**Parameters:** `tableData`
**Description:** Updates various details of the club using data from `tableData`.
**Example:**
```javascript
cy.clubDetailsUpdate({
    holiday: 'Sunday',
    googleMap: 'https://maps.google.com',
    instagram: 'https://instagram.com/test',
    tiktok: 'https://tiktok.com/@test',
    x: 'https://twitter.com/test',
    line: 'https://line.me/test',
    website: 'https://test.com',
    facebook: 'https://facebook.com/test',
    regularFee: '1000',
    designationFee: '2000',
    companionFee: '3000',
    extensionFee: '4000',
    drinksFee: '500',
    tax: '10',
    description: 'Test club description.',
    workingHoursFrom: '18:00',
    workingHoursTo: '02:00',
    lastEntryTime: '01:00',
    lastOrderTime: '01:30',
    closingDate: 'Monday'
});
```

### cy.writeHostClubDescription
**Parameters:** `values`, `outputSelector`, `description`
**Description:** Writes a description for the host club, replacing placeholders in `description` with actual values from `values`, and outputs it to the specified location.
**Example:**
```javascript
cy.writeHostClubDescription({
    clubNameEng: 'Test Club',
    clubNameKatakana: 'テストクラブ',
    description: 'This is a test description for {{clubNameEng}} also known as {{clubNameKatakana}}.'
}, '[name="description"]', 'This is a test

