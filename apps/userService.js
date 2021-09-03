const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWTSecret} = require('../config/index');

module.exports = {
    register,
    authentication
};

async function register(userParams) {

    try {
        let user = await userModel.create(userParams);
        return ({user: user, status: 201});
    } catch (e) {
        return ({user: e.message, status: 400})
    }


}


async function authentication(email, password) {

    let user;
    user = await userModel.findOne({email: email.toLowerCase()});

    if (!user) return ({message: 'user not found!', status: 404});
    let passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return ({message: 'authentication failed,password is not valid!', status: 404});
    let token = jwt.sign({id: user._id}, JWTSecret);
    return ({message: token, status: 200})


}
