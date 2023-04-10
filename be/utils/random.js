import cryptoRandomString from 'crypto-random-string';

export function genCryptoRandomString(len) {
    return cryptoRandomString({length: len});
}