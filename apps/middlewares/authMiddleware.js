const jwt = require('jsonwebtoken');
const {JWTSecret} = require('../../config/index');
const userModel = require('../../models/userModel');


module.exports = (req, res, next) => {

    let token = req.headers['token'];
    if (!token) return res.status(401).send( {message:'No token provided'});

    jwt.verify(token, JWTSecret, function (err, decoded) {
        if (err) return res.status(501).send({ message: 'user token is not valid!'});

        userModel.findById(decoded.id, {password: 0, verificationCode: 0}).then(function (user) {
            if (user) {
                req.body.user = user._id;
                next();
            } else {
                res.status(501).json("user token is not valid!")
            }


        })

    });


}

