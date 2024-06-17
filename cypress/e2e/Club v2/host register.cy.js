describe('Registers Hosts', () => {

  it('Get Registered Club Data & Register Host', () => {

    const filePath = 'club_creds/uat Clubs/Credentials'
    const clubName = 'Moment Club'
    const hostFilePath = [`Excel Files/Club Data/Host Data/Host Data`, clubName, 0]

    cy.fixture(filePath).then(clubCreds => {
      let clubData
      for (let i = 0; i < clubCreds.length; i++) {
        clubData = clubCreds[i];

        if (clubData.clubName === clubName) {
          cy.clubLogin(clubData.server, clubData.userName, clubData.password);
          break; // Break the loop when the condition matches
        }
      }

      cy.readXlsx(hostFilePath[0], hostFilePath[1], hostFilePath[2]).then(hostDetails => {

        hostDetails.forEach(hostData => {
          cy.visit(`${Cypress.env(clubData.server).clubUrl}/add-staff`)

          if (hostData.logoPath) {
            cy.get('[type="file"]').eq(0).selectFile('')
          }

          cy.dropdown([
            ['[name="rank"]', hostData.rank, ""],
            ['[name="position"]', hostData.position, ""],
            ['[name="birthPlace"]', hostData.birthPlace, ""],
            ['[name="bloodType"]', hostData.bloodType, ""],
            ['[name="zodiacSign"]', hostData.zodiac, ""],
            ['[name="formerJob"]', hostData.formerJob, ""],
            ['[name="alcohol"]', hostData.alcohol, ""],
            ['[name="height"]', hostData.height, ""],


          ])

          cy.typeText([
            ['[data-e2e="hostNameJapanese"]', hostData.hostNameKatakana, 0, ''],
            ['[data-e2e="hostName"]', hostData.hostName, 0, ''],

            ['[data-e2e="yyyy"]', hostData.year, 0, ''],
            ['[data-e2e="MM"]', hostData.month, 0, ''],
            ['[data-e2e="DD"]', hostData.day, 0, ''],

            ['[data-e2e="instagram"]', hostData.instagram, 0, ''],
            ['[data-e2e="tikTok"]', hostData.tikTok, 0, ''],
            ['[data-e2e="x"]', hostData.x, 0, ''],
            ['[data-e2e="line"]', hostData.line, 0, ''],

            ['[data-e2e="Hobby"]', hostData.personality1, 0, ''],
            ['[data-e2e="Special Skill"]', hostData.personality2, 0, ''],
            ['[data-e2e="Qualifications"]', hostData.personality3, 0, ''],
            ['[data-e2e="Proud of"]', hostData.personality4, 0, ''],
            ['[data-e2e="Favorite Things"]', hostData.personality5, 0, ''],
            ['[data-e2e="Dislikes"]', hostData.personality6, 0, ''],
            ['[data-e2e="Habits or Catchphrases"]', hostData.personality7, 0, ''],
            ['[data-e2e="Personality"]', hostData.personality8, 0, ''],
            ['[data-e2e="Smoking"]', hostData.personality9, 0, ''],
            ['[data-e2e="Charm Points"]', hostData.personality10, 0, ''],

            ['[data-e2e="休日の過ごし方"]', hostData.lifestyle1, 0, ''],
            ['[data-e2e="よく遊びに行く場所"]', hostData.lifestyle2, 0, ''],
            ['[data-e2e="旅行してみたい場所"]', hostData.lifestyle3, 0, ''],
            ['[data-e2e="男友達とよくやること"]', hostData.lifestyle4, 0, ''],
            ['[data-e2e="よく使うスマホアプリ"]', hostData.lifestyle5, 0, ''],
            ['[data-e2e="女の子をデートに連れて行くなら"]', hostData.lifestyle6, 0, ''],
            ['[data-e2e="必ず持ち歩いているモノ"]', hostData.lifestyle7, 0, ''],
            ['[data-e2e="自分磨きで気をつけていること"]', hostData.lifestyle8, 0, ''],
            ['[data-e2e="将来の夢・やりたいこと"]', hostData.lifestyle9, 0, ''],
            ['[data-e2e="ホストとしての今後の目標"]', hostData.lifestyle10, 0, ''],





          ])
          cy.get('.css-7syzqw').each((element, index) => {
            const skillProperty = `skill${index + 1}`;
            const skillIndex = hostData[skillProperty];
            if (skillIndex) {
              cy.wrap(element).find('.css-rube6c').eq(skillIndex - 1).click({ force: true });
            }
          });


          let introductionText = `こんにちは、みなさん。私の名前は${hostData.hostNameKatakana}です。`;
          introductionText += `私のクラブ、${clubData.clubNameKatakana}をご紹介します。`;
          if (hostData.birthPlace) {
            introductionText += `私は${hostData.birthPlace}で生まれました。`;
          }
          introductionText += `このクラブは日本屈指の観光地のひとつです。`;
          cy.get('[data-e2e="introduction"]').click().invoke('val', introductionText).wait(100);
          cy.get('[data-e2e="release"]').click().wait(1000)

        })
      })


    })
  })
})

