describe("Create Gallery File Path", () => {
    const env = "uat";


    const clubFilePath = ['Excel Files/Club Data/ClubData', 'Sheet1', 0];
    const filePath = 'club_creds/uat Clubs/Credentials';

    it("Create Gallery File Path", () => {
        const description = "ついに「{{clubNameEng}}」が登場しました☆ 説明は不要です！このプロフェッショナル集団は、熟練のホストから若きカリスマまで、多彩な才能が揃っています。彼らの高い接客スキルは、一度体験する価値がありますよ！"

        cy.writeHostClubDescription({clubNameEng:"ACqua"},"",description)
        // cy.readXlsx(clubFilePath[0], clubFilePath[1], clubFilePath[2]).then(clubData => {
        //     clubData.forEach(club => {
        //         const galleryPath = club.gallery + "/" + club.clubNameEng + "/Gallery"
        //         if (club.gallery) {
        //             cy.CreateImagePath(galleryPath)
        //         }
        //         const hostFilePath = ['Excel Files/Club Data/Host Data/Host Data', club.clubNameEng, 0];
        //         cy.readXlsx(hostFilePath[0], hostFilePath[1], hostFilePath[2]).then(hostData => {
        //             hostData.forEach(host => {
        //                 const hostGalleryPath = club.gallery + "/" + club.clubNameEng + "/" + host.hostName
        //                 cy.CreateImagePath(hostGalleryPath)
        //             })

        //         })
        //     })

        // })


    })
})