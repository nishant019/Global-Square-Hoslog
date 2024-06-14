describe('Download gallery', () => {
  it('visits club site and downloads gallery', () => {
    cy.viewport(1080, 720);
    const getIndex = 1
    const groupName = 'Acqua'
    cy.fixture("Club and host info/" + groupName + ".json").then((e) => {



      cy.wrap(e).each((ur, i) => {
        if (i !== 21) return;

        let jsonDataArray = []

        const url = ur.url
        cy.log(url)

        cy.visit(url);
        cy.get('[class="cell link"] .img').each((host, index) => {
          // if (index >= 2) return;
          cy.visit(url);
          cy.get('[class="cell link"] .img').eq(index).click()
          // cy.log(cy.location())
          // cy.wait(1000000)


          // cy.get('[class="cell link"] .img').eq(index).then(e=>{
          //   cy.log(e.href)
          //   cy.wait(1000000)
          // })
          // cy.get('[class="cell link"] .img').eq(index).click()

          cy.url().then(hostUrl => {
            cy.get('.staff-name').then(name => {
              const staffName = name[0].innerText

              cy.url().then((url) => {
                const folderName = url.split('/')[5];
                cy.get('.cmt').then(cmt => {
                  const heightAndDob = cmt[0].innerText;
                  const strippedHeightAndDob = heightAndDob.replace('誕生日：', '');
                  const heightSegment = strippedHeightAndDob.split(' / ')[1];
                  const dobSegment = strippedHeightAndDob.split(' / ')[0];

                  const month = dobSegment.includes('月') ? dobSegment.split('月')[0] : '?';
                  const day = dobSegment.includes('日') ? dobSegment.split('月')[1].split('日')[0] : '?';
                  const year = dobSegment.includes('年') ? dobSegment.split('年')[0] : '?';
                  const dobMonth = month === '?' ? '9' : month.includes('年') ? month.split('年')[1] : month;
                  const dobDay = day === '?' ? '9' : day;
                  const dobYear = year === '?' ? '1995' : year;
                  const height = heightSegment.replace('身長：', '').replace('cm', '');

                  const bloodGroupAndConsti = cmt[1].innerText;
                  const strippedBloodGroup = bloodGroupAndConsti.split(' / ')[0];
                  const strippedConsti = bloodGroupAndConsti.split(' / ')[1];
                  const bloodGrp = strippedBloodGroup.replace('血液型：', '').replace('型', '+');
                  const bloodGroup = bloodGrp === '?' ? 'A' : bloodGrp;
                  const consti = strippedConsti === '?' ? strippedConsti.split('星座：')[0] : 'さそり座'

                  let position, mail, line, twitter, insta, staffDescription, socialLinks
                  try {
                    cy.get('.staff-post', { timeout: 5000 }).should(post => { }).then(post => {
                      if (post.length > 0) {
                        position = post[0].innerText;
                      }
                      const socialLinks = {};
                      cy.get('dl', { timeout: 5000 }).should(ssl => { }).then(ssl => {
                        if (ssl.length > 0) {
                          const socialLinksArray = ssl[0].innerText.replace(/：\n/g, ' :- ').split("\n");
                          socialLinksArray.forEach((link) => {

                            if (link.includes("LINE")) {
                              socialLinks.LINE = link.split(" :- ")[1];

                            } else if (link.includes("X")) {
                              socialLinks.X = link.split(" :- ")[1];
                            } else if (link.includes("Twitter")) {
                              socialLinks.Twitter = link.split(" :- ")[1];
                            } else if (link.includes("Instagram")) {
                              socialLinks.Instagram = link.split(" :- ")[1];
                            }
                          });
                        }


                        //   const textContent = ssl[0].innerText;
                        //   socialLinks = JSON.stringify(textContent)

                        cy.get('.staff-cmt', { timeout: 5000 }).should(staffDesc => { }).then(staffDesc => {
                          if (staffDesc.length > 0) {
                            staffDescription = staffDesc[0].innerText
                          }
                          const jsonFile = {
                            staffName, dobDay, dobMonth, dobYear, height, bloodGroup, consti, position, socialLinks, staffDescription, folderName, hostUrl
                          }
                          cy.log('data array', JSON.stringify(jsonFile))

                          jsonDataArray.push(jsonFile);



                        })


                      })
                    });
                  } catch (error) {
                    Cypress.log({ message: `Error with staff post: ${error.message}` });
                  }

                })
              });
            })
          })
        })
        cy.log('data array', JSON.stringify(jsonDataArray))
        const filePath = `json output/Host/${groupName}/Original/${url.split('/')[4]}.json`;
        cy.writeFile(filePath, jsonDataArray, 'utf-8');

      })

    })
  })
});
