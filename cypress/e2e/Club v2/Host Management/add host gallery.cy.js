describe("Gallery management", () => {
    const env = "uat";
    const clubName = 'Galaxy Club';

    const hostFilePath = 'Excel Files/Club Data/Host Data/Host Data'
    const filePath = 'club_creds/uat Clubs/Credentials';
    const startIndex = 0
    const endIndex = ''
    it("Manage gallery", () => {
        cy.fixture(filePath).then(clubCreds => {
            let clubData;
            for (let i = 0; i < clubCreds.length; i++) {
                clubData = clubCreds[i];

                if (clubData.clubName === clubName) {
                    cy.clubLogin(clubData.server, clubData.userName, clubData.password);

                    cy.readXlsx(hostFilePath, clubName, startIndex, endIndex).then(hostDetails => {

                        hostDetails.forEach(hostData => {
                            const imageLocation = hostData.GalleryImageList + '/' + clubData.clubName + '/' + hostData.hostName
                            cy.uploadGallery(env,imageLocation, hostData.hostName)
                        });
            
                    });
                }

            }
        });


    });
})
