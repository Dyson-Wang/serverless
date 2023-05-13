const { readFileSync, writeFileSync, mkdirSync } = require("node:fs");
// const genCryptoRandomString = require("./rand.js");

const writeDataToNewFileSync = (data, fileName, config) => {
    mkdirSync(`./src/faas/${fileName}`);
    writeFileSync(`./src/faas/${fileName}/func.js`, data, {
        encoding: 'utf8'
    });
    writeFileSync(`./src/faas/${fileName}/config.json`, JSON.stringify(config), {
        encoding: 'utf8'
    })
}

const writeDataToFileSync = (data, fileName, config) => {
    writeFileSync(`./src/faas/${fileName}/func.js`, data, {
        encoding: 'utf8'
    });
    writeFileSync(`./src/faas/${fileName}/config.json`, JSON.stringify(config), {
        encoding: 'utf8'
    })
}

function readFileSyncToData(filename) {
    return {
        funcjs: readFileSync(`./src/faas/${filename}/func.js`, {
            encoding: 'utf8'
        }),
        confjson: readFileSync(`./src/faas/${filename}/config.json`, {
            encoding: 'utf8'
        }),
    }
}

module.exports = {
    writeDataToFileSync,
    writeDataToNewFileSync,
    readFileSyncToData
}