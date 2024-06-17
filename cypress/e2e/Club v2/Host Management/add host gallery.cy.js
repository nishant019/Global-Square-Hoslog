describe("Gallery management", () => {
    const env = "uat";
    const clubName = 'Galaxy Club';

    const hostFilePath = ['Excel Files/Club Data/Host Data/Host Data', clubName, 0];
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

        cy.readXlsx(hostFilePath[0], hostFilePath[1], hostFilePath[2]).then(hostDetails => {

            hostDetails.slice(0, 1).forEach(hostData => {
                const imageLocation = hostData.GalleryImageList + '/' + clubName + '/' + hostData.hostName
                cy.uploadGallery(env,imageLocation, hostData.hostName)
            });

        });
    });
})
