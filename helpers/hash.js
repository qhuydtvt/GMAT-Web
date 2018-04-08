const bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);

const generateHash = (plainText) => {
    return bcrypt.hashSync(plainText, salt);
};

const compareHash = (plainText, hash) => {
    return bcrypt.compareSync(plainText, hash);
}

module.exports = {
    generateHash,
    compareHash
};