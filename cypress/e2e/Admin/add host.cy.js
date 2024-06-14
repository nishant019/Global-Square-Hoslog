describe('Add club', () => {
  it('Logs in and adds club', () => {
    const cons = {
      "牡羊座": "牡羊座",
      "牡牛座": "牡牛座",
      "双子座": "双子座",
      "蟹座": "蟹座",
      "獅子座": "獅子座",
      "乙女座": "乙女座",
      "天秤座": "天秤座",
      "さそり座": "蠍座",
      "射手座": "射手座",
      "山羊座": "山羊座",
      "水瓶座": "水瓶座",
      "魚座": "魚座"
    }

    const groupName = 'Acqua'
    cy.adminLogin()
    cy.get('[href="/ClubManagement/ClubList"] > .menuContainer').click()

    cy.fixture('Club and host info/' + groupName).then(data => {
      data.slice(23,24).forEach(club => {

        const url = club.url
        const address = club.address
        const clubname = url.split('/')[4]
        cy.removeSp(club.clubName).then(result => {
          cy.get('form > .relative > .input-search').clear().type(`${result}{enter}`)
        })

        cy.get('.flex > .la-user').eq(0).click()



        cy.fixture(`Club and host info/Host/${groupName}/new/${clubname}` + '.json').then(host => {

          host
            .slice(0)
            .forEach((item) => {

              const directoryPath = `./cypress/downloads/club pictures/${'Group ' + groupName}/${clubname}/Hosts/${item.folderName}`;

              cy.checkFolderContents(directoryPath)
                .then(files => {
                  cy.extractJapaneseText(item.staffName).then(staffName => {

                    let position
                    if (item.position) {
                      position = item.position
                    } else {
                      position = 'ホスト'
                    }

                    cy.get('[data-drawer-target="add-new-host"]').click().wait(500)
                    cy.get('#HostName').type(staffName.english);
                    cy.get('#HostNameJapanese').type(staffName.japanese);


                    cy.get('#Position').type(position);
                    const index = host.indexOf(item) + 1;
                    if (index <= 15) {
                      cy.get('[name="Rank"]').select(index, { force: true });
                    }


                    if (files.length > 0) {
                      cy.get('.file-input').selectFile(`${directoryPath}/${files[0]}`, { force: true })
                    } else {
                      cy.get('.file-input').selectFile(`./cypress/downloads/logo.jpg`, { force: true })
                    }

                    cy.get('[name="BirthYearKey"]').select(item.dobYear, { force: true });
                    cy.get('[name="BirthMonthKey"]').select(item.dobMonth, { force: true });
                    cy.get('[name="BirthDayKey"]').select(item.dobDay, { force: true }).wait(500);
                    cy.get('#Address').type(address.replace('\n', ' '))

                    const bloodGroup = item.bloodGroup
                    const replacedBloodGroup = bloodGroup.replace(/[+-]/g, '型');
                    if (replacedBloodGroup !== '?型') {
                      cy.get('[name="BloodGroupDDLKey"]').select(replacedBloodGroup, { force: true })
                    } else {
                      cy.get('[name="BloodGroupDDLKey"]').select(1, { force: true })
                    }
                    const japaneseZodiac = item.consti;
                    const zodiac = cons[japaneseZodiac];
                    cy.get('[name="ZodiacSignsDDLKey"]').select(zodiac, { force: true })

                    cy.get('[name="OccupationDDLKey"]').select('サービス・警備・清掃', { force: true })

                    cy.get('#Height').type(item.height === '?' ? '0' : item.height);

                    cy.get('[name="LiquorStrengthDDLKey"]').select('強い', { force: true })
                    cy.get('#HostIntroduction').click().invoke('val', `こんにちは、みなさん。私の名前は${staffName.japanese}です。私のクラブ、${club.clubNameKana}をご紹介します。このクラブは${address.replace('\n', ' ')}にあり、日本屈指の観光地のひとつです。`).wait(100);
                    cy.get('#nextBtn').click()


                    if (item.hasOwnProperty('socialLinks')) {
                      if (item.socialLinks.hasOwnProperty('X')) {
                        cy.get('#TwitterLink').type(item.socialLinks.X)
                      } else {
                        cy.get('#TwitterLink').type('-')

                      }
                      if (item.socialLinks.hasOwnProperty('Instagram')) {
                        cy.get('#InstagramLink').type(item.socialLinks.Instagram)
                      } else {
                        cy.get('#InstagramLink').type('-')
                      }
                      cy.get('#TiktokLink').type('-')
                      if (item.socialLinks.hasOwnProperty('LINE')) {
                        cy.get('#Line').type(item.socialLinks.LINE)
                      } else {
                        cy.get('#Line').type('-')
                      }

                    } else {
                      cy.get('#TwitterLink').type('-')
                      cy.get('#InstagramLink').type('-')
                      cy.get('#TiktokLink').type('-')
                      cy.get('#Line').type('-')
                    }
                    cy.get('#nextBtn').click()


                    cy.get('[name="HostIdentityDataModel[0].IdentityDDLType"]').select(6, { force: true })
                    cy.get('#HostIdentityDataModel_0__IdentityDescription').type('0')
                    cy.get('[name="HostIdentityDataModel[1].IdentityDDLType"]').select(5, { force: true })
                    cy.get('#HostIdentityDataModel_1__IdentityDescription').type('0')
                    cy.get('[name="HostIdentityDataModel[2].IdentityDDLType"]').select(4, { force: true })
                    cy.get('#HostIdentityDataModel_2__IdentityDescription').type('0')
                    cy.get('[name="HostIdentityDataModel[3].IdentityDDLType"]').select(3, { force: true })
                    cy.get('#HostIdentityDataModel_3__IdentityDescription').type('0')
                    cy.get('[name="HostIdentityDataModel[4].IdentityDDLType"]').select(2, { force: true })
                    cy.get('#HostIdentityDataModel_4__IdentityDescription').type('0')
                    cy.get('[name="HostIdentityDataModel[5].IdentityDDLType"]').select(1, { force: true })
                    cy.get('#HostIdentityDataModel_5__IdentityDescription').type('0')

                    // cy.get('#HostIdentityDataModel_6__IdentityDescription').type('料理')
                    // cy.get('#HostIdentityDataModel_7__IdentityDescription').type('ダンス')
                    // cy.get('#HostIdentityDataModel_8__IdentityDescription').type('絵画')
                    // cy.get('#HostIdentityDataModel_9__IdentityDescription').type('スポーツ')
                    // cy.get('#HostIdentityDataModel_10__IdentityDescription').type('音楽')
                    // cy.get('#HostIdentityDataModel_11__IdentityDescription').type('読書')
                    // cy.get('#HostIdentityDataModel_12__IdentityDescription').type('旅行')
                    // cy.get('#HostIdentityDataModel_13__IdentityDescription').type('映画鑑賞')
                    // cy.get('#HostIdentityDataModel_14__IdentityDescription').type('ゲーム')
                    // cy.get('#HostIdentityDataModel_15__IdentityDescription').type('ハイキング')
                    // cy.get('#nextBtn').click()


                    // cy.get('#HostIdentityDataModel_16__IdentityDescription').type('晴れた日には公園でピクニックを楽しむことや、友人と一緒に映画を見に行くことが好きです。')
                    // cy.get('#HostIdentityDataModel_17__IdentityDescription').type('よく遊びに行く場所は、近くのカフェやレストランです。友人と集まって楽しい時間を過ごします。')
                    // cy.get('#HostIdentityDataModel_18__IdentityDescription').type('旅行してみたい場所はヨーロッパです。特にイタリアやフランスの美しい街を訪れたいと思っています。')
                    // cy.get('#HostIdentityDataModel_19__IdentityDescription').type('男友達とよくやることはスポーツ観戦やバーベキューをすることです。楽しい時間を過ごします。')
                    // cy.get('#HostIdentityDataModel_20__IdentityDescription').type('よく使うスマホアプリはSNSアプリです。友人とのコミュニケーションに利用しています。')
                    // cy.get('#HostIdentityDataModel_21__IdentityDescription').type('女の子をデートに連れて行くなら、美味しいレストランや素敵な景色のある場所に連れて行きたいです。')
                    // cy.get('#HostIdentityDataModel_22__IdentityDescription').type('必ず持ち歩いているモノは、スマートフォンと財布です。常に身に着けています。')
                    // cy.get('#HostIdentityDataModel_23__IdentityDescription').type('自分磨きで気をつけていることは健康管理です。定期的に運動をして健康を維持しています。')
                    // cy.get('#HostIdentityDataModel_24__IdentityDescription').type('将来の夢は自分のビジネスを立ち上げることです。自分のアイデアを形にして成功させたいと思っています。')
                    // cy.get('#HostIdentityDataModel_25__IdentityDescription').type('ホストとしての今後の目標は、より多くのゲストに快適な滞在を提供することです。おもてなしの心を大切にしています。')

                    cy.get('#submit-button-id').click()

                    cy.get('#countries').select(4, { force: true }).wait(1000)

                    cy.contains('tbody tr', staffName.english).find('.las.la-image').click()
                    if (files.length > 0) {
                      files.forEach((img, ind) => {
                        cy.get('[data-drawer-target="add-new-gallery"]').click().wait(200)
                        cy.get('#ImageTitle').type(ind + 1)
                        cy.get('#file_input-gallery').selectFile(`${directoryPath}/${img}`, { force: true })
                        cy.get('.btn-primary > button').click().wait(500)
                      })

                    }

                    cy.get('[class="flex items-center text-[#667085] gap-2 cursor-pointer"]').click().wait(1000)

                  })
                })
            })
          cy.get('[class="flex items-center text-[#667085] gap-2 cursor-pointer"]').click().wait(1000)

        })

      });
    });
  });
});





