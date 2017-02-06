'use strict';

var cryptoJson = require('crypto-json');
var fs = require('fs');
var path = require('path');
var logger = console;

var ROOT = path.join(__dirname, '../');
var SECRET_FILE = 'environments/parts/secrets.js';
var SECRET_ENC_FILE = 'environments/parts/secrets.enc.js';
var KEY_FILE = 'configkey.js';
var KEY_ENVVAR = 'CONFIG_KEY';

var getFromFile = function getFromFile() {
    try {
        return fs.readFileSync(path.join(ROOT, KEY_FILE));
    } catch (err) {
        return false;
    }
};

var objectToFile = function objectToFile(object) {
    return '\n/**\n *  Sensative parts of environment variables.\n *  Encrytpt / decrypt with "npm run encrypt" or "npm run decrypt"\n *  Do not store unencrypted in repostiory!\n */\nmodule.exports = ' + JSON.stringify(object, null, 4) + ';\n';
};

if (require.main === module) {
    var OPERATION = process.env.npm_lifecycle_event;

    var KEY = process.env[KEY_ENVVAR];
    if (!KEY) {
        KEY = getFromFile();
    }
    if (!KEY) {
        logger.error('Either ' + KEY_ENVVAR + ' should be set in environment or ' + KEY_FILE + ' should be used');
    }

    var readFile = void 0,
        writeFile = void 0;
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
        var read = fs.readFileSync(readFile);
        var newObj = cryptoJson[OPERATION](read, KEY, { encoding: 'base64' });
        fs.writeFileSync(writeFile, objectToFile(newObj));
    } catch (err) {
        logger.error(err);
    }
}
