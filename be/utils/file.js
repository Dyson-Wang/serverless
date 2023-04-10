import { readFileSync, writeFileSync } from "node:fs";
import { genCryptoRandomString } from "./random.js";

export const writeDataToNewFileSync = (data) => {
    writeFileSync(genCryptoRandomString(16), data);
}

export const writeDataToFileSync = (filePath, data) => {
    writeFileSync(filePath, data);
}

export function readFileSyncToData() {
    
}