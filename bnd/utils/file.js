const { readFileSync, writeFileSync, mkdirSync } = require("node:fs");
// const genCryptoRandomString = require("./rand.js");

const writeDataToNewFileSync = (data, fileName, config) => {
    mkdirSync(`./src/faas/${fileName}`);
    writeFileSync(`./src/faas/${fileName}/func.js`, data, {
        encoding: 'utf8'
    });
    writeFileSync(`./src/faas/${fileName}/config.js`, JSON.stringify(config), {
        encoding: 'utf8'
    })
}

const writeDataToFileSync = (filePath, data) => {
    writeFileSync(filePath, data);
}

function readFileSyncToData(filePath) {
    return readFileSync(filePath, {
        encoding: 'utf8'
    })
}

module.exports = {
    writeDataToFileSync,
    writeDataToNewFileSync,
    readFileSyncToData
}