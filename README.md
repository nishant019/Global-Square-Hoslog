# Club and Host Data Management README

This document outlines the structure and requirements for managing club and host data using Excel files and automation scripts in Cypress.

## Club Data

### Excel File: `ClubData.xlsx`
`cypress\fixtures\Excel Files\Club Data\ClubData.xlsx`
This Excel file has details about clubs, with fields needed for registration and updating club information. The main sheet should be named Sheet1 and should have these headers:

| clubNameEng | clubNameKatakana | english | groupName | city | street | buildingRoomNumber | landlineNumber | postalCode | location | prefecture | businessType | ceoName | ceoNameKata | companyName | companyNameKatakana | kycFileLocation | businessFileLocation | idFrontFileLocation | idBackFileLocation | mobile | email | clubBanner | clubLogo | description | googleMap | holiday | workingHoursFrom | workingHoursTo | lastEntryTime | lastOrderTime | instagram | tiktok | x | line | website | facebook | regularFee | designationFee | companionFee | extensionFee | drinksFee | tax | closingDate | password | gallery |
|-------------|-----------------|---------|-----------|------|--------|-------------------|----------------|------------|----------|------------|--------------|---------|-------------|-------------|---------------------|-----------------|---------------------|---------------------|--------------------|--------|-------|------------|----------|-------------|-----------|---------|-----------------|---------------|---------------|---------------|-----------|--------|---|------|---------|----------|------------|----------------|--------------|--------------|----------|-----|-------------|----------|---------|

### Notes:

- `businessType` should be 'co' for corporate and 'in' for individual.
- `companyName` is required if `businessType` is 'co'.
- File locations (`kycFileLocation`, `businessFileLocation`, `idFrontFileLocation`, `idBackFileLocation`) should specify the exact path on the device.

### Auto-Generated Fields:

- `description` is automatically generated using `clubNameEng` and is similar for multiple clubs.
- `password` is used during the set password process.
- `gallery` specifies the location of the images folder. In later Automations , this directory will be used to create folders in the format `{{gallery}}\{{club_name}}\Gallery`.


## Host Data

### Excel File: `Host Data.xlsx`
`cypress\fixtures\Excel Files\Club Data\Host Data\Host Data.xlsx`

This Excel file includes details about hosts linked to each club. Each sheet should be named after the `clubNameEng` from `ClubData.xlsx` and should have these headers:

| hostName | hostNameKatakana | rank | title | position | year | month | day | birthPlace | bloodType | zodiac | formerJob | alcohol | height | instagram | tiktok | x | line | skill1 | skill2 | skill3 | skill4 | skill5 | skill6 | personality1 | personality2 | personality3 | personality4 | personality5 | personality6 | personality7 | personality8 | personality9 | personality10 | lifestyle1 | lifestyle2 | lifestyle3 | lifestyle4 | lifestyle5 | lifestyle6 | lifestyle7 | lifestyle8 | lifestyle9 | lifestyle10 | GalleryImageList |
|----------|------------------|------|-------|----------|------|-------|-----|------------|-----------|--------|-----------|---------|--------|-----------|--------|---|------|--------|--------|--------|--------|--------|--------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|---------------|------------|------------|------------|------------|------------|------------|------------|------------|------------|-------------| ---------------- |

 - `GalleryImageList` specifies the location of the images folder. In later Automations , this directory will be used to create folders in the format `{{gallery}}\{{club_name}}\Gallery`.

### Notes:

- **Skills**: Values for `skills` should range from 1 to 5. Values outside this range may cause the test to fail.
  
- **Dropdown Values**: The following fields have predefined options that must be selected from dropdown menus to ensure accuracy:
  - `rank`
  - `position`
  - `birthPlace`
  - `bloodType`
  - `zodiac`
  - `formerJob`
  - `alcohol`
  - `height`

Ensuring these values match the predefined options will help maintain data consistency and accuracy within the system.

## cypress.env.json
```json
{
  "uat": {
    "clubUrl": "https://v2.hoslog.jp",
    "adminUrl": "https://uatsuperadmin.hoslog.jp/",
    "adminPassword": "********",
    "adminLogin": "********"
  },
  "live": {
    "clubUrl": "https://club.hoslog.jp",
    "adminUrl": "https://admin.hoslog.jp/",
    "adminPassword": "********",
    "adminLogin": "********"
  }
}
```


# Automation Scripts
## How Read XLSX Works [commands.js]

`cy.readXlsx(inputFile, sheetName, startIndex, maxRow)`

- **inputFile**: Path to the spreadsheet located in the fixtures folder of the Cypress project, e.g., `Excel Files/Club Data/ClubData`.
- **sheetName**: The name of the sheet to read and write.
- **startIndex**: The starting row index.
- **maxRow**: The maximum row index to iterate over in the spreadsheet. If all rows are to be processed, this parameter can be commented out or an empty string (`''`) or simply `null` can be passed.

## Club Management
### 1. Create Gallery File Path
#### Script Path: `cypress\e2e\Club v2\Create Gallery File Path.cy.js`

This script automates the creation of folder structures for galleries based on the `gallery` value specified in `ClubData.xlsx`. For each club and host, folders will be created in the format:

- For clubs: `{{gallery}}\{{clubNameEng}}\Gallery`
- For hosts (if sheet exists): `{{gallery}}\{{clubNameEng}}\{{hostName}}`

#### Ensure Images for Gallery Management

Make sure there are images inside these folders to run the Gallery Management script for both clubs and hosts.

During Club Registration:
- If there is an image in the Gallery folder with 'logo' and 'banner' in its name, they will be uploaded accordingly on the club panel.
- If such images are not present, the first image file in the Gallery folder will be uploaded.

#### Manual Folder Management

Alternatively, you can manually create folders corresponding to `clubNameEng` and `hostName` in the specified `gallery` location for effective gallery management.

### 2. Club Registration
#### Script Path: `cypress\e2e\Club v2\Club Management\Club Registration.cy.js`

Parameters:
- **env**: Specifies the environment, which can be either `'uat'` or `'live'`.
- **startIndex**: Indicates the starting index in the Excel sheet, where indexing starts from 0 up to the maximum index.
- **endIndex**: (To be filled based on specific usage)
- **filePath**: Path to the directory containing club credentials under the respective environment (`'club_creds/uat Clubs/Credentials'`).

This script automates the following processes:
- Filling out the registration form
- Admin approval
- Fetching the username and password from email/SMS log
- Setting a new password
- Filling out club details

After setting the password, all user credentials are stored in `cypress\fixtures\club_creds/{{env}}`.


### 3. Merge Registered User Into JSON
#### Script Path: `cypress\e2e\Club v2\Merge Registered User JSON.cy.js`

The folder path `let folderPath = "club_creds/uat"` <br>
should be in the `fixtures` directory. This script merges previously created users from their respective folders and adds them to another folder called `{{env}} clubs`, where a new file is created, for example: `cypress\fixtures\club_creds/uat Clubs/Credentials.json`. 

Example of the JSON structure:

```json
[
  {
    "userName": "ka1***472",
    "password": "************",
    "clubName": "Test Club",
    "clubNameKatakana": "レイスクラブ",
    "server": "uat"
  },
  {
    "userName": "ka10****73",
    "password": "************",
    "clubName": "Test Club2",
    "clubNameKatakana": "レイスクラブ",
    "server": "uat"
  }
]
```

This process is essential for storing all clubs registered using the automation and is crucial for further test runs.


### 4. Add Club Gallery

#### Script Path: `cypress\e2e\Club v2\Club Management\add club gallery.cy.js`

This script automates the task of adding labels for galleries across multiple clubs listed in a spreadsheet. It also facilitates uploading images to those galleries if the corresponding folder, created using the Create Gallery File Path automation, exists.

#### Parameters:
- **env**: Specifies the environment, which can be either `'uat'` or `'live'`.
- **startIndex**: Indicates the starting index in the Excel sheet, where indexing starts from 0 up to the maximum index.
- **endIndex**: To be filled based on specific usage to define the range of clubs to process.
- **filePath**: Path to the directory containing club credentials under the respective environment (`'club_creds/uat Clubs/Credentials'`).

This script integrates with the Create Gallery File Path automation to ensure that labels are correctly assigned to galleries for each club. Adjust `endIndex` according to the number of clubs or entries in your spreadsheet to cover the desired range effectively.

### 5. Club Gallery Management

#### Script Path: `cypress\e2e\Club v2\Club Management\club gallery management.cy.js`

This script automates the management of club galleries uploading banners, logos, and gallery images across multiple clubs listed in a spreadsheet.

#### Parameters:
- **env**: Specifies the environment, which can be either `'uat'` or `'live'`.
- **startIndex**: Indicates the starting index in the Excel sheet, where indexing starts from 0 up to the maximum index.
- **endIndex**: To be filled based on specific usage to define the range of clubs to process.
- **filePath**: Path to the directory containing club credentials under the respective environment (`'club_creds/uat Clubs/Credentials'`).

This script comprehensively manages club galleries by:
- Adding labels for galleries associated with each club.
- Uploading club banners, logos, and gallery images to their respective locations.
  
This script ensures that all club-related media and gallery management tasks are handled seamlessly within the specified environment.


## Host Management

### 1. Host Register
### Host Registration

This script automates the registration process for hosts associated with a specific club, leveraging data from an Excel spreadsheet.

#### Purpose

The script aims to streamline the registration of hosts by:
- Logging into the club's system using credentials retrieved from the specified environment.
- Reading host details from an Excel sheet (`hostFilePath`) specific to the club (`'Galaxy Club'`).
- Iterating through each host's details to populate registration fields with information such as name, birthdate, social media handles, personal attributes, lifestyle preferences, and skills.
- Constructing an introductory text dynamically based on the host's details and the club's information.

#### Parameters
- **env**: Specifies the environment, typically `'uat'` for testing or `'live'` for production.
- **clubName**: Name of the club where hosts are being registered (`'Galaxy Club'` in this case).
- **hostFilePath**: Path to the Excel file containing host data (`'Excel Files/Club Data/Host Data/Host Data'`).
- **filePath**: Directory path containing club credentials under the specified environment (`'club_creds/uat Clubs/Credentials'`).
- **startIndex**: Starting index in the Excel sheet for reading host data.
- **endIndex**: To be defined based on specific requirements to limit the number of hosts processed.

#### Workflow
1. **Club Login**: Logs into the club's system using credentials retrieved from `filePath` for the specified `clubName`.
2. **Read Host Data**: Retrieves host details from the Excel sheet specified by `hostFilePath`.
3. **Host Registration Form**: Navigates to the host registration page (`'/add-staff'`) for each host, waits for the page to load.
4. **Populate Form Fields**: Fills out the registration form fields with data from the Excel sheet, including dropdown selections and text inputs.
5. **Skill Selection**: Selects skills based on predefined indices (`skill1` to `skill6`) from the host's data.
6. **Introduction Text**: Constructs an introductory text dynamically based on the host's details and the club's information.
7. **Submit Registration**: Clicks the release button to submit the registration form after completing all fields.

#### Note

This script facilitates the efficient registration of hosts by automating manual data entry tasks, thereby improving accuracy and saving time during the onboarding process.

### 2. Host Gallery Management

#### Script Path: `cypress\e2e\Club v2\Club Management\host gallery management.cy.js`

This script automates the management of club galleries uploading thumbnail, logos, and host gallery images across multiple specified listed in a parameter i.e clubName.
#### Parameters:
- **env**: Specifies the environment, which can be either `'uat'` or `'live'`.
- **clubName**: Name of the club for which host galleries are managed (`'Galaxy Club'` in this case).
- **hostFilePath**: Path to the Excel file containing host data (`'Excel Files/Club Data/Host Data/Host Data'`).
- **filePath**: Path to the directory containing club credentials under the respective environment (`'club_creds/uat Clubs/Credentials'`).
- **startIndex**: Indicates the starting index in the Excel sheet, where indexing starts from 0 up to the maximum index.
- **endIndex**: To be filled based on specific usage to define the range of hosts to process.

This script manages host galleries by:
- Logging into the club's system using credentials retrieved from the specified environment.
- Reading host details from an Excel sheet (`hostFilePath`) specific to the `clubName`.
- Iterating through each host's details to construct image locations and upload host gallery images.

Adjust `endIndex` according to the number of hosts or entries in your spreadsheet to effectively process the desired range of hosts. This script ensures that host-related media and gallery management tasks are automated within the specified environment.

### 3. Gallery Management
#### Script Path: `cypress\e2e\Club v2\Club Management\add host gallery.cy.js`

This script automates the process of managing galleries for hosts associated with a specific club. It reads host details from an Excel sheet, logs into the club's system, navigates to the appropriate pages, and uploads images accordingly.

#### Purpose

The script aims to streamline the management of host galleries by:
- Reading host details from an Excel sheet (`hostFilePath`) for a specific club (`'Galaxy Club'`).
- Logging into the club's system using credentials retrieved from a file (`filePath`).
- Iterating through each host's details to manage their respective image galleries.
- Navigating to the club's staff management page, searching for hosts, and uploading images based on the folder structure specified in `GalleryImageList`.

#### Parameters
- **env**: Specifies the environment (`'uat'` for testing).
- **clubName**: Name of the club (`'Galaxy Club'`) where gallery management is performed.
- **hostFilePath**: Path to the Excel file containing host data (`'Excel Files/Club Data/Host Data/Host Data'`).
- **filePath**: Path to the directory containing club credentials (`'club_creds/uat Clubs/Credentials'`).
- **startIndex**: Starting index in the Excel sheet for reading host data.
- **endIndex**: To be defined based on specific requirements for limiting the number of hosts processed.

#### Workflow
1. **Read Host Data**: Reads host details from the specified Excel sheet (`hostFilePath`).
2. **Club Login**: Logs into the club's system using credentials from `filePath` for the specified `clubName`.
3. **Manage Galleries**: if respective host has images in their folder, from gallery their folder name and label is selected and images are selected from gallery 

#### Note
- Adjust `endIndex` based on your specific needs to control how many hosts are processed during each execution.
- Ensure the folder structure and naming conventions (`GalleryImageList`, `hostName`, etc.) align with the actual structure and data in your testing or production environment.

This script enhances efficiency by automating manual steps involved in managing host image galleries, ensuring accurate and consistent management across multiple hosts within the specified club.

## Custom Commands

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

