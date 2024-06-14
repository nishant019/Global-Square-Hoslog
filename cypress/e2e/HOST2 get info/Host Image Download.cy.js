describe('Download gallery', () => {
  it('visits club site and downloads gallery', () => {
    cy.viewport(1080, 720);
    const groupName = 'Acqua'
    const start = 23
    const end = 25
    cy.fixture("Club and host info/"+groupName + ".json").then(e => {
      e.slice(start, end).forEach(urls => {
        const newUrl = urls.url
        cy.visit(newUrl, { timeout: 240000 })

        try {
          cy.get('[class="cell link"] .img').each((host, index) => {
            // if (index <= 9) return;
            cy.visit(newUrl);
            cy.get('[class="cell link"] .img').eq(index).click()

            cy.get('.cts ul .item img', { timeout: 5000 }).should(($images) => {

            })
              .then(($img) => {
                for (let i = 0; i < $img.length; i++) {
                  if ($img.length > 0) {
                    cy.get('.cts ul .item img').eq(i).click().wait(1500);
                    cy.get('#lightbox-image').then(($images) => {
                      const imagesUrl = $images[0].src;
                      const clubName = imagesUrl.split('/')[4];
                      const HostName = imagesUrl.split('/')[5];
                      const FileName = imagesUrl.split('/')[6];
                      // cy.log('imagesUrl: ',imagesUrl,clubName,HostName)

                      cy.request({
                        method: 'GET',
                        url: imagesUrl,
                        headers: {
                          'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        },
                        encoding: 'binary',
                      }).then((response) => {
                        cy.writeFile(`./cypress/downloads/club pictures/${'Group ' + groupName}/${clubName}/Hosts/${HostName}/${FileName}`, response.body, 'binary');
                      }).wait(1000);
                      cy.get('#lightbox-secNav-btnClose > img').click().wait(1000)

                    })

                  };
                }
              });

          })

        } catch (error) {
          Cypress.log({ message: `Error: ${error.message}` });
        }

      });
    })
  });
});