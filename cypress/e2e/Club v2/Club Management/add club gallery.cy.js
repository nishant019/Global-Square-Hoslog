describe("Gallery management", () => {
    const env = "uat";
    const startIndex = 0
    const endIndex = ''
    const filePath = 'club_creds/uat Clubs/Credentials';
    it("Manage gallery", () => {
        cy.readXlsx('Excel Files/Club Data/ClubData', 'Sheet1', startIndex,endIndex).then(clubSheet => {
            cy.fixture(filePath).then(clubCreds => {

                clubCreds.forEach((clubData, index) => {
                    if (clubData.clubName === clubSheet[index].clubNameEng){
                        cy.clearCacheData()

                        cy.clubLogin(clubData.server, clubData.userName, clubData.password);
                        const imageLocation = clubSheet[index].gallery + '/' + clubSheet[index].clubNameEng + '/Gallery'
                        cy.uploadGallery(env, imageLocation, "Gallery")
                    }

                })

            });

        });
    });
})
