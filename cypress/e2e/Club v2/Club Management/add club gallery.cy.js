describe("Gallery management", () => {
    const env = "uat";
    const clubName = 'Galaxy Club';

    const filePath = 'club_creds/uat Clubs/Credentials';
    before("Login to club", () => {

        cy.fixture(filePath).then(clubCreds => {
            let clubData;
            for (let i = 0; i < clubCreds.length; i++) {
                clubData = clubCreds[i];

                if (clubData.clubName === clubName) {
                    cy.clubLogin(clubData.server, clubData.userName, clubData.password);

                    break; // Break the loop when the condition matches
                }
            }
        });
    });

    it("Manage gallery", () => {
        cy.readXlsx('Excel Files/Club Data/ClubData', 'Sheet1', 0).then(clubData => {

            clubData.forEach(club => {
                if (club.clubNameEng === clubName) {
                    const imageLocation = club.gallery + '/' + clubName + '/Gallery'
                    cy.uploadGallery(env, imageLocation, "Gallery")
                }
            });

        });
    });
})
