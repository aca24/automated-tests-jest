var md5 = require('md5');

const NAME = 'Aleksandar Savic';
const NEW_NAME = 'Aca Savic';
const PASSWORD = md5('12345');
const INVALID_USER_ID = '-10.9';

module.exports = {
    NAME,
    NEW_NAME,
    PASSWORD,
    INVALID_USER_ID
};