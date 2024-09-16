describe("Gallery management", () => {
    const env = "uat";

    const filePath = 'club_creds/uat Clubs/Credentials';
    it("Manage gallery", () => {
        cy.readXlsx('Excel Files/Club Data/ClubData', 'Sheet1').then(clubData => {
            clubData.forEach(club => {
                if (club.fillData === true) {
                    cy.fixture(filePath).then(clubCreds => {
                        clubCreds.forEach(loginData => {
                            if (club.clubNameEng === loginData.clubName) {
                                cy.clearCacheData();
                                cy.clubLogin(loginData.server, loginData.userName, loginData.password);
                                const imageLocation = club.gallery + '/' + club.clubNameEng + '/Gallery';
                                cy.uploadGallery(env, imageLocation, "Gallery");
                             }
                        })
                    })
                }
            })
        })
        
    });
});
