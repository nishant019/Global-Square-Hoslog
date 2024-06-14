describe('template spec', () => {
  it('passes', () => {
    let folderPath = "club_creds/uat"
    let json = []
    cy.task('listFixturesFolder', { filePath: folderPath }).then(files => {
      files.forEach(file => {
        cy.log(file)
        cy.readFile(`cypress/fixtures/${folderPath}/${file}`).then(e => {

          cy.log("filecontents", JSON.stringify(e), "___", e.clubName, file.split(' ')[0])
          e.server = file.split(' ')[0]
          json.push(e)
          // json.push(file)
        })
      })
      cy.writeFile(`cypress/fixtures/${folderPath.split(' ')[0]} Clubs/Credentials.json`, json)

    });
  })
})