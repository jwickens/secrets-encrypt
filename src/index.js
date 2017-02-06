#!/usr/bin/env node

const cryptoJson = require('crypto-json');
const fs = require('fs');
const path = require('path');
const logger = console;

const ROOT = path.join(__dirname, '../../../');
const SECRET_FILE = 'environments/parts/secrets.js';
const SECRET_ENC_FILE = 'environments/parts/secrets.enc.js';
const KEY_FILE = 'configkey.js';
const KEY_ENVVAR = 'CONFIG_KEY';

const getFromFile = () => {
    try {
        return fs.readFileSync(path.join(ROOT, KEY_FILE));
    } catch (err) {
        return false;
    }
};

const objectToFile = object =>
`
/**
 *  Sensative parts of environment variables.
 *  Encrytpt / decrypt with "npm run encrypt" or "npm run decrypt"
 *  Do not store unencrypted in repostiory!
 */
module.exports = ${JSON.stringify(object, null, 4)};
`;

if (require.main === module) {
    const OPERATION = process.env.npm_lifecycle_event;

    let KEY = process.env[KEY_ENVVAR];
    if (! KEY) {
        KEY = getFromFile();
    }
    if (! KEY) {
        logger.error(`Either ${KEY_ENVVAR} should be set in environment or ${KEY_FILE} should be used`);
    }

    let readFile, writeFile;
    switch (OPERATION) {
        case 'encrypt':
            readFile = path.join(ROOT, SECRET_FILE);
            writeFile = path.join(ROOT, SECRET_ENC_FILE);
            break;
        case 'decrypt':
            readFile = path.join(ROOT, SECRET_ENC_FILE);
            writeFile = path.join(ROOT, SECRET_FILE);
            break;
    }
    try {
        const read = fs.readFileSync(readFile);
        const newObj = cryptoJson[OPERATION](read, KEY, { encoding: 'base64'});
        fs.writeFileSync(writeFile, objectToFile(newObj));
    } catch (err) {
        logger.error(err);
    }

}
