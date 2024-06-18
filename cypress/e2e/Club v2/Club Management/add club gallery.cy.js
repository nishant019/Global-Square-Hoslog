describe("Gallery management", () => {
    const env = "uat";

    const filePath = 'club_creds/uat Clubs/Credentials';
    before("Login to club", () => {


    });

    it("Manage gallery", () => {
        cy.readXlsx('Excel Files/Club Data/ClubData', 'Sheet1', 0).then(clubSheet => {
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
