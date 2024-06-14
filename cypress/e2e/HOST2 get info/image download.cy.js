describe('Download gallery', () => {
  it('visits club site and downloads gallery', () => {
    cy.viewport(1080, 720);
    const groupName = 'Acqua'
    cy.fixture("Club and host info/"+groupName+".json").then(e => {
      e.slice(0).forEach(urls => {
        const newUrl = urls.url.replace('index', 'system')
        cy.visit(newUrl, { timeout: 240000 })
        cy.get('.bd > .img > img').then((logo) => {
          const logoUrl = logo[0].src
          const clubName = logoUrl.split('/')[4]
          const filename = logoUrl.split('/')[5]
          cy.request({
            method: 'GET',
            url: logoUrl,
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            encoding: 'binary',
          }).then((response) => {
            // expect(response.status).to.eq(200);
            cy.writeFile(`./cypress/downloads/club pictures/${'Group '+groupName}/${clubName}/${filename}`, response.body, 'binary');
          }).wait(1500);


        })
        try {
          cy.get('.shop-pr-cts > img', { timeout: 5000 }).should(($banner) => {

          })
            .then(($banner) => {
              if ($banner.length > 0) {
                const bannerUrl = $banner[0].src;
                const clubName = bannerUrl.split('/')[4];
                const filename = bannerUrl.split('/')[5];

                cy.request({
                  method: 'GET',
                  url: bannerUrl,
                  headers: {
                    'User-Agent':
                      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                  },
                  encoding: 'binary',
                }).then((response) => {
                  cy.writeFile(`./cypress/downloads/club pictures/${'Group '+groupName}/${clubName}/${filename}`, response.body, 'binary');
                }).wait(1500);
              };
            });
        } catch (error) {
          Cypress.log({ message: `Error: ${error.message}` });
        }



        try {
          cy.get('.j-img-fix img').should((images) => { }).then((images) => {
            for (let i = 0; i < images.length; i++) {
              cy.get('.j-img-fix img').eq(i).click().wait(1500);
              cy.get('#lightbox-image').then((e) => {
                const imageUrl = e[0].src;
                const clubName = imageUrl.split('/')[4];
                const filename = imageUrl.split('/')[5]; // Use [5] for the filename

                cy.request({
                  method: 'GET',
                  url: imageUrl,
                  headers: {
                    'User-Agent':
                      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                  },
                  encoding: 'binary',
                }).then((response) => {
                  expect(response.status).to.eq(200);
                  cy.writeFile(`./cypress/downloads/club pictures/${'Group '+groupName}/${clubName}/${filename}`, response.body, 'binary');
                }).wait(1500);
                cy.get('#lightbox-secNav-btnClose > img').click().wait(1500)
              });
            }
          });

        } catch (error) { Cypress.log({ message: `Error: ${error.message}` }); }
      });
    })
  });
});