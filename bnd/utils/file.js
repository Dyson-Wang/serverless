const { readFileSync, writeFileSync, mkdirSync, existsSync } = require("node:fs");
// const genCryptoRandomString = require("./rand.js");

const writeDataToNewFileSync = (data, fileName, config) => {
    if (!existsSync(`./src/faas/${fileName}`)) mkdirSync(`./src/faas/${fileName}`);
    writeFileSync(`./src/faas/${fileName}/func.js`, data, {
        encoding: 'utf8'
    });
    writeFileSync(`./src/faas/${fileName}/config.json`, JSON.stringify(config), {
        encoding: 'utf8'
    })
}

const writeDataToTestFileSync = (data, fileName, config) => {
    if (!existsSync(`./src/faas/${fileName}/test`)) mkdirSync(`./src/faas/${fileName}/test`);
    writeFileSync(`./src/faas/${fileName}/test/func.js`, data, {
        encoding: 'utf8'
    });
    writeFileSync(`./src/faas/${fileName}/test/config.json`, JSON.stringify(config), {
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
    writeDataToTestFileSync,
    writeDataToNewFileSync,
    readFileSyncToData
}