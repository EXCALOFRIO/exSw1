const bcrypt = require('bcrypt');
const { use } = require('../../routes');
const { user } = require('..');

users = {};

users.data = {};

users.generateHash = function (password, callback) {
    bcrypt.hash(password, 10, callback);
}

users.comparePass = async function (password, hash) {
    return await bcrypt.compare(password, hash);
}

users.register = function (username, password, carrito = []) {
    if (users.data.hasOwnProperty(username)) {
        throw new Error(`Ya existe el usuario ${username}.`);
    }
    users.generateHash(password, function (err, hash) {
        if (err) {
            throw new Error(`Error al generar el hash de ${username}.`);
        }
        users.data[username] = { username, hash, last_Login: new Date().toISOString, carrito };
    });
}

users.isUsernameTaken = function (username) {
    return users.data.hasOwnProperty(username);
}

users.isLoginRight = async function (username, password) {
    if (!users.data.hasOwnProperty(username)) {
        return false;
    }
    return await users.comparePass(password, users.data[username].hash);
}

users.saveCart = function (username, carrito) {
    if (!users.data.hasOwnProperty(username)) {
        throw new Error(`No existe el usuario ${username}.`);
    }
    users.data[username].carrito = carrito;
}

users.getCart = function (username) {
    if (!users.data.hasOwnProperty(username)) {
        throw new Error(`No existe el usuario ${username}.`);
    }
    return users.data[username].carrito;
}

users.aceptarCookies = function (username, cookies) {
    console.log('cookies en aceptarCookies:', cookies);
    if (!users.data.hasOwnProperty(username)) {
        throw new Error(`No existe el usuario ${username}.`);
    }
    users.data[username].cookies = cookies;
}

users.getCookies = function (username) {
    if (!users.data.hasOwnProperty(username)) {
        throw new Error(`No existe el usuario ${username}.`);
    }
    return users.data[username].cookies;
}


module.exports = users;