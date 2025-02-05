const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salt = 10;

// register
async function encryptPassword(password) {
    try {
        const result = await bcrypt.hash(password, salt);
        return result;
    } catch (e) {
        throw e;
    }
}

// login
async function checkPassword(encryptedPassword, password) {
    try {
        const result = await bcrypt.compare(password, encryptedPassword);
        return result;
    } catch (e) {
        throw e;
    }
}

async function createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1800s",
    });
}

async function createRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
}

module.exports = {
    encryptPassword,
    checkPassword,
    createToken,
    createRefreshToken,
};
