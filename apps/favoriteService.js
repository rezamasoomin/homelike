const favoriteModel = require('../models/favoriteModel');

module.exports = {
    addNewFavorite,
    getFavoriteList
};


/**
 * @api {post} /addNewFavorite add new apartment to favorite list
 * @apiName add favorite
 * @apiGroup 3.FavoriteService
 * @apiVersion 0.1.0
 *
 * @apiParam (Headers_params)   {String} token token of user
 *
 * @apiParam (Body_params)  {String} apartmentId  apartment id
 *
 *
 * @apiSuccess {Object} favorite  favorite details.
 * @apiSuccess {Object} favorite[_id]   id of favorite .
 * @apiSuccess {Object} favorite[user]  user id.
 * @apiSuccess {[Object]} favorite[apartments]  favorite apartments of user.
 * @apiSuccess {String} apartments[title]  title of apartment.
 * @apiSuccess {Object} apartments[user]  apartment creator.
 * @apiSuccess {Number} apartments[rooms]  count of apartment rooms.
 * @apiSuccess {String} apartments[country]  country of apartment.
 * @apiSuccess {String} apartments[city]  city of apartment.
 * @apiSuccess {Object} apartments[location]  location of apartment.
 * @apiSuccess {String} location[type]   type of Location.
 * @apiSuccess {[Number]} location[coordinates]  coordinates of Location.
 * @apiSuccess {Object} message[createdAt] created date
 * @apiSuccess {Object} message[updatedAt] last update date
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
    "favorite": {
        "_id": "6133eaa93442652103079769",
        "user": "6133c188da4b5386f978712b",
        "apartments": [
            {
                "_id": "6133c4df7dffd6f899cdade2",
                "user": "6133c188da4b5386f978712b",
                "title": "nice apartment",
                "rooms": 2,
                "country": "Germany",
                "city": "Berlin",
                "location": {
                    "type": "Point",
                    "coordinates": [
                        52.530121,
                        13.41475
                    ],
                    "_id": "6133c4df7dffd6f899cdade3"
                },
                "createdAt": "2021-09-04T19:11:27.566Z",
                "updatedAt": "2021-09-04T19:11:27.566Z",
                "__v": 0
            }
        ],
        "createdAt": "2021-09-04T21:52:41.787Z",
        "updatedAt": "2021-09-04T21:52:52.745Z"
    }
}
 *

 *@apiError  Data-Not-Set all data not set!.
 *@apiErrorExample Data-Not-Set:
 *     HTTP/1.1 400 data error
 *   {
 *   "message": "apartment validation failed: title: title is required!"
 *   }
 *
 *@apiError (Error 5xx)  errors in creating new apartment!.
 *@apiErrorExample Not Authorized:
 *     HTTP/1.1 501 token error
 *   {
 *   "message": "user token is not valid!"
 *      }
 */
async function addNewFavorite(apartmentId, userId) {

    try {

        let favorite = await favoriteModel.findOne({user: userId});

        if (favorite) {
            await favoriteModel.findOneAndUpdate({user: userId}, {$addToSet: {apartments: apartmentId}});
            let newFavorite = await favoriteModel.findOne({user: userId}).populate("apartments");
            return ({favorite: newFavorite, status: 200});
        } else {
            let newFavorite = await favoriteModel.create({user: userId, apartments: [apartmentId]});
            return ({favorite: newFavorite, status: 200});

        }


    } catch (e) {
        return ({favorite: e.message, status: e.status ? e.status : 400})
    }

}




/**
 * @api {get} /favorites get all favorites list
 * @apiName favorites list
 * @apiGroup 3.FavoriteService
 * @apiVersion 0.1.0
 *
 *
 *
 * @apiSuccess {[Object]} favoriteList  favorites.
 * @apiSuccess {Object} favoriteList[_id]   id of favorite .
 * @apiSuccess {Object} favoriteList[user]  user id.
 * @apiSuccess {Object} user[name] name of user
 * @apiSuccess {Object} user[email] email address of user
 * @apiSuccess {Object} user[_id]  user id
 * @apiSuccess {Object} user[createdAt] created date
 * @apiSuccess {Object} user[updatedAt] last update date
 * @apiSuccess {[Object]} favoriteList[apartments]  favorite apartments of user.
 * @apiSuccess {String} apartments[title]  title of apartment.
 * @apiSuccess {Object} apartments[user]  apartment creator.
 * @apiSuccess {Number} apartments[rooms]  count of apartment rooms.
 * @apiSuccess {String} apartments[country]  country of apartment.
 * @apiSuccess {String} apartments[city]  city of apartment.
 * @apiSuccess {Object} apartments[location]  location of apartment.
 * @apiSuccess {String} location[type]   type of Location.
 * @apiSuccess {[Number]} location[coordinates]  coordinates of Location.
 * @apiSuccess {Object} favoriteList[createdAt] created date
 * @apiSuccess {Object} favoriteList[updatedAt] last update date
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *{
    "favoriteList": [
        {
            "_id": "6133eaa93442652103079769",
            "user": {
                "_id": "6133c188da4b5386f978712b",
                "name": "reza",
                "email": "rezamasoomin.n@email.com",
                "createdAt": "2021-09-04T18:57:12.732Z",
                "updatedAt": "2021-09-04T18:57:12.732Z",
                "__v": 0
            },
            "apartments": [
                {
                    "_id": "6133c4df7dffd6f899cdade2",
                    "user": "6133c188da4b5386f978712b",
                    "title": "nice apartment",
                    "rooms": 2,
                    "country": "Germany",
                    "city": "Berlin",
                    "location": {
                        "type": "Point",
                        "coordinates": [
                            52.530121,
                            13.41475
                        ],
                        "_id": "6133c4df7dffd6f899cdade3"
                    },
                    "createdAt": "2021-09-04T19:11:27.566Z",
                    "updatedAt": "2021-09-04T19:11:27.566Z",
                    "__v": 0
                }
            ],
            "createdAt": "2021-09-04T21:52:41.787Z",
            "updatedAt": "2021-09-04T21:52:52.745Z"
        }
    ]
}
 */


async function getFavoriteList() {

    try {
        let favoriteList = await favoriteModel.find().populate("apartments").populate("user","-password");
        if (!favoriteList.length) return ({favoriteList: favoriteList, status: 404});

        return ({favoriteList: favoriteList, status: 200});
    } catch (e) {
        return ({favoriteList: e.message, status: 400})
    }
}
