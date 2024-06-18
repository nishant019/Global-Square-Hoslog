describe("Create Gallery File Path", () => {
    let clubName
    const clubFilePath = ['Excel Files/Club Data/ClubData', 'Sheet1', 0]; 
    const hostFilePath = ['Excel Files/Club Data/Host Data/Host Data', clubName, 0];

    it("Create Gallery File Path", () => {
        cy.readXlsx(clubFilePath[0], clubFilePath[1], clubFilePath[2]).then(clubData => {
            clubData.forEach(club => {
                const galleryPath = club.gallery + "/" + club.clubNameEng + "/Gallery"
                if (club.gallery) {
                    cy.CreateImagePath(galleryPath)
                }
                clubName = club.clubNameEng
                cy.readXlsx(hostFilePath[0], clubName, hostFilePath[2]).then(hostData => {
                    hostData.forEach(host => {
                        const hostGalleryPath = club.gallery + "/" + club.clubNameEng + "/" + host.hostName
                        cy.CreateImagePath(hostGalleryPath)
                    })

                })
            })

        })


    })
})