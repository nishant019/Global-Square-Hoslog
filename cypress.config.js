const { defineConfig } = require("cypress");
const xlsx = require('node-xlsx').default;
const readXlsx = require('./read-xlsx.js');
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  redirectionLimit: 80,
  chromeWebSecurity: true,
  experimentalWebKitSupport: true,
  requestTimeout: 30000,
  experimentalMemoryManagement: true,
  responseTimeout: 50000,
  pageLoadTimeout: 100000,
  numTestsKeptInMemory: 0,
  e2e: {
    setupNodeEvents(on, config) {
      // Register tasks
      on('task', {
        parseXlsx({ filePath }) {
          return new Promise((resolve, reject) => {
            try {
              const fileContents = fs.readFileSync(filePath);
              const jsonData = xlsx.parse(fileContents);
              resolve(jsonData);
            } catch (e) {
              reject(e);
            }
          });
        },

        listFixturesFolder({ filePath }) {
          const fixturesFolderPath = path.join(__dirname, 'cypress', 'fixtures', filePath);
          return new Promise((resolve, reject) => {
            fs.readdir(fixturesFolderPath, (err, files) => {
              if (err) {
                return reject(err);
              }
              resolve(files);
            });
          });
        },

        readFileSync(folderPath) {
          try {
            const contents = fs.readdirSync(folderPath);
            return contents;
          } catch (error) {
            return error.toString();
          }
        },

        readFolder(folderPath) {
          return new Promise((resolve) => {
            if (!folderPath) {
              resolve({ error: 'Folder path is empty or not provided' });
              return;
            }
            fs.readdir(folderPath, (err, files) => {
              if (err) {
                resolve({ error: `Folder not found or an error occurred: ${err.message}` });
              } else {
                resolve({ files });
              }
            });
          });
        },

        readXlsx: readXlsx.read
      });

      return config;
    },
  },
});
