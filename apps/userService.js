const userModel = require('../models/userModel');

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


async function authentication(email,password) {

}
