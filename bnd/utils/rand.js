// const cryptoRandomString = require('crypto-random-string');
// import cryptoRandomString from 'crypto-random-string';
var srs = require('secure-random-string');

function genCryptoRandomString(len) {
    return srs({ length: len });
}

module.exports = genCryptoRandomString;