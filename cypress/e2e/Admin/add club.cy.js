
describe('Add club', () => {
  it('Login Admin and add a club', () => {
    const groupName = 'Acqua'

    cy.adminLogin()

    cy.get('[href="/ClubManagement/ClubList"] > .menuContainer').click()

    cy.fixture('Club and host info/' + groupName).then(data => {

      data.slice(20).forEach(e => {

        const imgPath = e.url;
        const folderName = imgPath.split('/')[4];
        const telePhone = e.telephone;
        const directoryPath = `./cypress/downloads/club pictures/${'Group ' + groupName}/${folderName.toLowerCase()}`;

        cy.get('#add-new-id').click().wait(500);
        cy.removeSp(e.clubName).then(result => {
          cy.get('#ClubName1').click().invoke('val',`${result}`).wait(100);
        })
        cy.get('#ClubName2').click().invoke('val', `${e.clubNameKana}`);
        cy.get('[name="BusinessTypeDDL"]').select(1, { force: true });
        cy.get('#GroupName').type(e.groupName+e.clubNameKana);
        cy.get('#CompanyName').type(e.clubNameKana);
        cy.get('#Email').type(`${folderName.replace(' ', '')}@gmail.com`);
        cy.get('[name="MobileNumber"]').type(telePhone+'012');
        cy.get('#LandlineNumber').type(telePhone)

        cy.get('#Description').click().type(e.description);
        cy.get('#ceoFullName').type(e.clubNameKana);
        cy.get('[name="LoginId"]').type(folderName.substring(0, 15));

        cy.get('#file_input_business_certificate').selectFile(`cypress/downloads/club pictures/Group ${groupName}/${folderName.replace(' ', '')}/logo.jpg`, { force: true });
        cy.get('#file_input_logo').selectFile(`cypress/downloads/club pictures/Group ${groupName}/${folderName.replace(' ', '')}/logo.jpg`, { force: true });
        cy.get('#file_input_cover').selectFile(`cypress/downloads/club pictures/Group ${groupName}/${folderName.replace(' ', '')}/pr_pic1.jpg`, { force: true });
        cy.get('#nextBtn').click();

        cy.get('[name="WebsiteLink"]').type('www.google.com');
        cy.get('#TiktokLink').type('www.tiktok.com');
        cy.get('#TwitterLink').type('www.twitter.com');
        cy.get('#InstagramLink').type('www.instagram.com');
        cy.get('#Line').type('www.line.com')
        cy.get('#GoogleMap').type('www.google.com')
        cy.get('#nextBtn').click();

        cy.get('#WorkingHrFrom').type('14:00:00')
        cy.get('#WorkingHrTo').type('21:00:00')
        cy.get('[name="holiday"]').select(3,{force:true})
        cy.get('#LastOrderTime').type('19:00')
        cy.get('#LastEntryTime').type('20:00')
        cy.get('#Tax').type('30')
        cy.get('[name="LocationDDL"]').select('歌舞伎町', { force: true });
        cy.get('#Longitude').type('1111');
        cy.get('#Latitude').type('1111');
        cy.get('#PostalCode').type('123-4567')
        cy.get('[name="Prefecture"]').select(2,{force:true})
        cy.get('#City').type('北海道')
        cy.get('#Street').type('北海道')
        cy.get('#BuildingRoomNo').type('北海道')
        cy.get('#nextBtn').click()

        cy.get('#RegularFee').type('10000')
        cy.get('#DesignationFee').type('8000')
        cy.get('#CompanionFee').type('5000')
        cy.get('#ExtensionFee').type('6000')
        cy.get('#Drink').type('15000')
        cy.get('[name="PlanDetailList[0].PlanIdentityList[0].IdentityDescription"]').select(1,{force:true})
        cy.get('#PlanDetailList_0__PlanIdentityList_1__IdentityDescription').type('20:00')
        cy.get('#PlanDetailList_0__PlanIdentityList_2__IdentityDescription').type('21:00')
        cy.get('#PlanDetailList_0__PlanIdentityList_3__IdentityDescription').type('10')
        
        cy.get('#addrow').click()
        // cy.get('[name="PlanDetailList[0].PlanIdentityList[1].IdentityDescription"]').select(1,{force:true})
        cy.get('[name="PlanDetailList[1].PlanIdentityList[1].IdentityDescription"]').type('20:00')

        cy.get('[name="PlanDetailList[1].PlanIdentityList[2].IdentityDescription"]').type('21:00')
        cy.get('[name="PlanDetailList[1].PlanIdentityList[3].IdentityDescription"]').type('10')

        cy.get('#submit-button-id').click().wait(1000);

        cy.removeSp(e.clubName).then(result => {
          cy.get('form > .relative > .input-search').clear().type(`${result}{enter}`)
        })

        // Gallery Image Upload
        cy.get('.las.la-image').then(e => {
          cy.get('.las.la-image').eq(0).click()
        })
        const folder = folderName.replace(' ', '')


        cy.checkFolderContents(directoryPath)
          .then((files) => {
            const filteredFiles = files.filter(file => !file.includes('Hosts') && !file.includes('pr_pic1.jpg') && !file.includes('logo.jpg') && file.endsWith('.jpg'));

            filteredFiles.forEach((file, ind) => {
              cy.log(filteredFiles[ind]);
              cy.get('[data-drawer-show="add-new-gallery"]').click()
              cy.get('#ImageTitle').type(ind + 1)
              if (filteredFiles[ind]) {
                cy.get('#file_input-gallery').selectFile(`cypress/downloads/club pictures/Group ${groupName}/${folder}/${filteredFiles[ind]}`, { force: true })
              }
              cy.get('.btn-primary > button').click().wait(1000)
            })
            cy.get('[class="flex items-center text-[#667085] gap-2 cursor-pointer"').click().wait(1000)
          })
      });

    });
  })


});


