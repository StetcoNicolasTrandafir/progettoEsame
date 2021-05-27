const crypto = require('crypto');
const ERRORS = require('errors');


ERRORS.create({
    code: 600,
    name: 'DB_CONNECTION',
    defaultMessage: 'An error occured when connecting to database'
});


const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {

    const cipher =  crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (encrypted) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(encrypted.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(encrypted.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};


function error(req, res, err) {
    res.status(err.code).send(err.message);
}


module.exports = {
    encrypt,
    decrypt
};


