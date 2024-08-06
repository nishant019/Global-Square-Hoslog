describe("Gallery management", () => {
    const env = "uat";
    const startIndex = 6
    const endIndex = 7
    const filePath = 'club_creds/uat Clubs/Credentials';
    it("Manage gallery", () => {
        cy.readXlsx('Excel Files/Club Data/ClubData', 'Sheet1', startIndex, endIndex).then(clubSheet => {
            cy.fixture(filePath).then(clubCreds => {

                clubCreds.forEach(clubData => {
                    const matchingClub = clubSheet.find(club => club.clubNameEng === clubData.clubName);

                    if (matchingClub) {
                        cy.clearCacheData();
                        cy.clubLogin(clubData.server, clubData.userName, clubData.password);
                        const imageLocation = matchingClub.gallery + '/' + matchingClub.clubNameEng + '/Gallery';
                        cy.uploadGallery(env, imageLocation, "Gallery");
                    }
                });

            });
        });
    });
});
