describe("Gallery management", () => {
    const env = "uat";
    const clubName = 'Eclipse Club';

    const hostFilePath = 'Excel Files/Club Data/Host Data/Host Data'
    const filePath = 'club_creds/uat Clubs/Credentials';
    const startIndex = 0
    const endIndex = ''
    it("Manage gallery", () => {
        cy.fixture(filePath).then(clubCreds => {

                clubCreds.forEach(clubData => {
                    cy.log(clubData.clubName === clubName)
                    if (clubData.clubName === clubName) {
                        cy.clubLogin(clubData.server, clubData.userName, clubData.password);
    
                        cy.readXlsx(hostFilePath, clubName, startIndex, endIndex).then(hostDetails => {
    
                            hostDetails.slice(0,2).forEach(hostData => {
                                const imageLocation = hostData.GalleryImageList + '/' + clubData.clubName + '/' + hostData.hostName
                                cy.uploadGallery(env,imageLocation, hostData.hostName)
                            });
                
                        });
                    }
                });


            
        })


    });
})
