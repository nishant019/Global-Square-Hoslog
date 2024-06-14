const clubName= 'Acqua'
it('should use the merged JSON', () => {

  const directoryPath = '/cypress/fixtures'
  const Original = `/Host/${clubName}/Original`
  const Replacer = `/Host/${clubName}/Replacer`
  cy.checkFolderContents(directoryPath + Original)
    .then(files => {
      files.forEach((file, index) => {
        let mergedJson = [];
        cy.fixture(Original + '/' + files[index]).then((json1) => {
          cy.fixture(Replacer + '/' + files[index].replace('.json', ' Host.json')).then((json2) => {
            json1.forEach((jsonO, ind) => {
              

              const folderName = json1[ind].folderName
              const staffName = json1[ind].staffName
              const dobDay = json2[ind].dobDay
              const dobMonth = json2[ind].dobMonth
              const dobYear = json2[ind].dobYear
              const bloodGroup = json2[ind].bloodGroup
              const height = json2[ind].height
              json2[ind].folderName = folderName
              json2[ind].staffName = staffName
              json2[ind].dobDay = dobDay
              json2[ind].dobMonth = dobMonth
              json2[ind].dobYear = dobYear
              json2[ind].bloodGroup = bloodGroup
              json2[ind].height = height
              mergedJson.push(json2[ind])
            })
            cy.writeFile(Cypress.config('projectRoot')+`/cypress/fixtures/Host/${clubName}/new/${files[index]}`, mergedJson, 'utf-8');


          });
        });
      })
    })


});
