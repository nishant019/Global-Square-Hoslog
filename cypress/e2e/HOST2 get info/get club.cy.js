describe('Visit club page and get club info', () => {
  it('saves club info in json', () => {
    cy.viewport(1080, 720);
    const url = 'https://www.host2.jp/cgi-bin/new/shop.cgi';
    const groupName = 'Acqua'
    cy.visit(url);
    const jsonDataArray = [];
    cy.get('[rel="0"] > form > .headSearchText').clear().type(`${groupName}{enter}`)

    cy.get(':nth-child(2) > li > label > input').click()
    // cy.get('[rel="0"] > form > .headSearchText').clear().type(groupName)
    cy.get('.form-submit > [type="submit"]').click()
    cy.get('[class="cell link"] .info').then(clubs => {
      

      for (let i = 0; i < clubs.length; i++) {
        // Alias the club element for clarity
        cy.get(clubs[i]).as('currentClub');

        cy.get('[class="cell link"] .info').eq(i).click();
        cy.wait(2000)
        // Alias the elements for better readability
        cy.get('.bd .cmt').as('groupNameElement');
        cy.get('.bd .area').as('areaNameElement');
        cy.get('.bd .tit').as('clubNameElement');
        cy.get('.bd .kana').as('clubNameKanaElement');
        cy.get('.bd .tel').as('telephoneElement');
        cy.get('.bd .adrs').as('addressElement');
        cy.get('.bd .info').as('descriptionElement');

        cy.get('@groupNameElement').then(cmt => {
          const groupName = cmt[0].innerText;

          cy.get('@areaNameElement').then(area => {
            const areaName = area[0].innerText;

            cy.get('@clubNameElement').then(tit => {
              const clubName = tit[0].innerText;

              cy.get('@clubNameKanaElement').then(kana => {
                const clubNameKana = kana[0].innerText;

                cy.get('@telephoneElement').then(tel => {
                  const tele = tel[0].innerText;
                  const telephone = (tele.split('TEL:')[1]).replace(/-/g, "");

                  cy.get('@addressElement').then(adrs => {
                    const address = adrs[0].innerText;

                    cy.get('@descriptionElement').then(info => {
                      const description = info[0].innerText;

                      cy.url().then(url => {
                        const jsonData = {
                          telephone,
                          groupName,
                          areaName,
                          clubName,
                          clubNameKana,
                          address,
                          description,
                          url
                        };
                        jsonDataArray.push(jsonData);
                      });
                    });
                  });
                });
              });
            });
          });
        });
        cy.get('[rel="0"] > form > .headSearchText').clear().type(`${groupName}{enter}`)
        // cy.visit(url);
        cy.get(':nth-child(2) > li > label > input').click()
        
        cy.get('.form-submit > [type="submit"]').click()
      }
      cy.log('data array', jsonDataArray)
      const filePath = `json output/${Date.now()}.json`;
      cy.writeFile(filePath, jsonDataArray, 'utf-8');
    });
  });
});
