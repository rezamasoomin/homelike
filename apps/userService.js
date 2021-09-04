const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWTSecret} = require('../config/index');

module.exports = {
    register,
    authentication
};


/**
 * @api {post} /register register new user
 * @apiName Register
 * @apiGroup 1.UserService
 * @apiVersion 0.1.0
 *
 *
 * @apiParam (Body_params)  {String} email email address of user
 * @apiParam (Body_params)  {String} password  password of user
 * @apiParam (Body_params) {String} name   name of user
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "rezamasoomin.n@email.com",
 *       "password":"LKJmnb123",
 *       "name":"reza"
 *     }
 *
 * @apiSuccess {Object} message  created user.
 * @apiSuccess {String} message[name] name of user
 * @apiSuccess {String} message[email] email address of user
 * @apiSuccess {String} message[_id]  user id
 * @apiSuccess {Date} message[createdAt] created date
 * @apiSuccess {Date} message[updatedAt] last update date
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
    "message": {
        "name": "reza",
        "email": "rezamasoomin.n@email.com",
        "_id": "6133bf54ea2fcf6a233f6bbd",
        "createdAt": "2021-09-04T18:47:48.497Z",
        "updatedAt": "2021-09-04T18:47:48.497Z"
    }
 }

 *@apiError  Required-Fields  email, name or password not set!.
 *@apiError  Duplicate-Key  duplicate key error for email!.
 *@apiErrorExample Required-Fields:
 *     HTTP/1.1 400 data error
 *   {
 *   "message": "user validation failed: email: email is required!"
 *   }
 *@apiErrorExample Duplicate-Key:
 *     HTTP/1.1 400 data error
 *   {
 *     "message": "E11000 duplicate key error collection: homelike.users index: email dup key: { email: \"rezamasoomin.n@email.com\" }"
 *   }
 */
async function register(userParams) {

    try {
        let user = await userModel.create(userParams);
        return ({user: user, status: 201});
    } catch (e) {
        return ({user: e.message, status: 400})
    }


}


/**
 * @api {post} /login user login
 * @apiName Login
 * @apiGroup 1.UserService
 * @apiVersion 0.1.0
 *
 *
 * @apiParam (Body_params)   {String} email user email address
 * @apiParam (Body_params)  {String} password   user password
 * @apiParamExample {json} Request-Example:
 *     {
 *        "email": "rezamasoomin.n@email.com",
 *        "password":"LKJmnb123"
 *     }
 *
 * @apiSuccess {String} message  token of user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *   "message": "eyJhbGciOiJIUzI1asfasdxMzNjMTg4ZGE0YjasdafasNzEyYiIsImlhdCI6MTYzMDc4MjA3Mn0.ARBYN9tRvttVztclnpqgbGkbNMFIQMc2TXRs_gR_A7M"
 *   }
 *
 *@apiError  User-Not-Found user not found in database.
 *@apiErrorExample  User-Not-Found :
 *     HTTP/1.1 404
 *    {
 *         "message": "user not found!"
 *    }
 *
 *@apiError  Invalid-Data email address or password is invalid!.
 *@apiErrorExample Invalid-Data:
 *     HTTP/1.1 404 data is not valid
 *   {
 *       "message": "authentication failed,password is not valid!"
 *   }
 */
async function authentication(email, password) {

    let user;
    user = await userModel.findOne({email: email.toLowerCase()});

    if (!user) return ({message: 'user not found!', status: 404});
    let passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return ({message: 'authentication failed,password is not valid!', status: 404});
    let token = jwt.sign({id: user._id}, JWTSecret);
    return ({message: token, status: 200})


}
