const apartmentModel = require('../models/apartmentModel');

module.exports = {
    createApartment,
    searchApartment,
    nearestApartment
};


/**
 * @api {post} /createApartment add new apartment
 * @apiName create apartment
 * @apiGroup 2.ApartmentService
 * @apiVersion 0.1.0
 *
 * @apiParam (Headers_params)   {String} token token of user
 *
 * @apiParam (Body_params) {String} title  title of apartment
 * @apiParam (Body_params) {Number} rooms count of apartment rooms
 * @apiParam (Body_params) {String} country   country of apartment
 * @apiParam (Body_params) {String} city   city of apartment
 * @apiParam (Body_params) {Object} [location]  location of apartment
 * @apiParam (Body_params) {String="Point"} [location][type]  type of Location
 * @apiParam (Body_params) {Number[]} [location][coordinates]  coordinates of Location
 *
 *
 * @apiSuccess {Object} message  created apartment.
 * @apiSuccess {String} message[user]  user id of the creator.
 * @apiSuccess {String} message[title]  title of apartment.
 * @apiSuccess {Number} message[rooms]  count of apartment rooms.
 * @apiSuccess {String} message[country]  country of apartment.
 * @apiSuccess {String} message[city]  city of apartment.
 * @apiSuccess {Object} message[location]  location of apartment.
 * @apiSuccess {String} [location[type]]  type of Location.
 * @apiSuccess {[Number]}[location[coordinates]]  coordinates of Location.
 * @apiSuccess {String} message[_id]  apartment id
 * @apiSuccess {Date} message[createdAt] created date
 * @apiSuccess {Date} message[updatedAt] last update date
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
    "message": {
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
        "_id": "6133c4df7dffd6f899cdade2",
        "createdAt": "2021-09-04T19:11:27.566Z",
        "updatedAt": "2021-09-04T19:11:27.566Z",
        "__v": 0
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
 *@apiError (Error 5xx)  Not-Authorized  user authorization error!.
 *@apiErrorExample Not Authorized:
 *     HTTP/1.1 501 token error
 *   {
 *   "message": "user token is not valid!"
 *      }
 */
async function createApartment(apartmentParams) {

    try {
        let apartment = await apartmentModel.create(apartmentParams);
        return ({apartment: apartment, status: 201});
    } catch (e) {
        return ({apartment: e.message, status: 400})
    }

}


/**
 * @api {get} /search search apartments by filters
 * @apiName search apartments
 * @apiGroup 2.ApartmentService
 * @apiVersion 0.1.0
 *
 * @apiSuccess {[Object]} message  apartments
 * @apiSuccess {Object} message[user]  apartment creator.
 * @apiSuccess {String} user[name] name of user
 * @apiSuccess {String} user[email] email address of user
 * @apiSuccess {String} user[_id]  user id
 * @apiSuccess {String} user[createdAt] created date
 * @apiSuccess {String} user[updatedAt] last update date
 * @apiSuccess {String} message[title]  title of apartment.
 * @apiSuccess {Number} message[rooms]  count of apartment rooms.
 * @apiSuccess {String} message[country]  country of apartment.
 * @apiSuccess {String} message[city]  city of apartment.
 * @apiSuccess {Object} message[location]  location of apartment.
 * @apiSuccess {String} location[type]   type of Location.
 * @apiSuccess {[Number]} location[coordinates]  coordinates of Location.
 * @apiSuccess {Date} message[_id]  apartment id
 * @apiSuccess {Date} message[createdAt] created date
 * @apiSuccess {Date} message[updatedAt] last update date
 *
 *
 * @apiParam (Query_params)   {String} [city]  city name
 * @apiParam (Query_params)   {String} [country]  country name
 * @apiParam (Query_params)   {Number} [rooms]  count of rooms
 *
 *
 * @apiSuccess {Object} message  apartments array.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
    "apartments": [
        {
            "_id": "6133c4df7dffd6f899cdade2",
            "user": {
                "_id": "6133c188da4b5386f978712b",
                "name": "reza",
                "email": "rezamasoomin.n@email.com",
                "createdAt": "2021-09-04T18:57:12.732Z",
                "updatedAt": "2021-09-04T18:57:12.732Z",
                "__v": 0
            },
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
    ]
}
 *
 *@apiError  Apartment-Not-Found apartment not found in database.
 *@apiErrorExample  Apartment not found :
 *     HTTP/1.1 404
 *    {
 *   "apartments": []
 *}
 *
 */
async function searchApartment(filters) {

    try {
        let apartments = await apartmentModel.find(filters).populate('user', '-password');
        if (!apartments.length) return ({apartments: apartments, status: 404});

        return ({apartments: apartments, status: 200});
    } catch (e) {
        return ({apartments: e.message, status: 400})
    }
}


/**
 * @api {get} /nearest search near apartments
 * @apiName search nearest apartments
 * @apiGroup 2.ApartmentService
 * @apiVersion 0.1.0
 *
 * @apiSuccess {Object[]} message  apartments
 *
 * @apiParam (Query_params)   {Number} longitude  longitude number
 * @apiParam (Query_params)   {Number} latitude  latitude number
 * @apiParam (Query_params)   {Number} maxDistance  max distance
 *
 * @apiSuccess {[Object]} message  apartments
 * @apiSuccess {Object} message[user]  apartment creator.
 * @apiSuccess {String} user[name] name of user
 * @apiSuccess {String} user[email] email address of user
 * @apiSuccess {String} user[_id]  user id
 * @apiSuccess {String} user[createdAt] created date
 * @apiSuccess {String} user[updatedAt] last update date
 * @apiSuccess {String} message[title]  title of apartment.
 * @apiSuccess {Number} message[rooms]  count of apartment rooms.
 * @apiSuccess {String} message[country]  country of apartment.
 * @apiSuccess {String} message[city]  city of apartment.
 * @apiSuccess {Object} message[location]  location of apartment.
 * @apiSuccess {String} location[type]   type of Location.
 * @apiSuccess {[Number]} location[coordinates]  coordinates of Location.
 * @apiSuccess {Date} message[_id]  apartment id
 * @apiSuccess {Date} message[createdAt] created date
 * @apiSuccess {Date} message[updatedAt] last update date
 *
 *
 * @apiSuccess {Object} message  apartments array.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
    "apartments": [
        {
            "_id": "6133c4df7dffd6f899cdade2",
            "user": {
                "_id": "6133c188da4b5386f978712b",
                "name": "reza",
                "email": "rezamasoomin.n@email.com",
                "createdAt": "2021-09-04T18:57:12.732Z",
                "updatedAt": "2021-09-04T18:57:12.732Z",
                "__v": 0
            },
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
            "updatedAt": "2021-09-04T19:11:27.566Z"

        }
    ]
}
 *

 *@apiError  Apartment-Not-Found apartment not found in database.
 *@apiErrorExample  Apartment-Not-Found :
 *     HTTP/1.1 404
 *    {
 *   "apartments": []
 *}
 *@apiError  Invalid-Data invalid longitude,latitude and maxDistance.
 *@apiErrorExample  Invalid-Data :
 *     HTTP/1.1 404
 *    {
 *    "apartments": "invalid geometry arguments please check longitude,latitude and maxDistance"
 *}
 *
 */


async function nearestApartment(longitude, latitude, maxDistance) {

    let location = {
        '$nearSphere': {
            '$geometry': {
                'type': "Point",
                'coordinates': [longitude, latitude]
            },
            '$minDistance': 0,
            '$maxDistance': Number(maxDistance ? maxDistance : 10000)
        }

    };

    try {

        let apartments = await apartmentModel.find({location: location}).populate("user","-password");
        if (!apartments.length) return ({apartments: apartments, status: 404});
        return ({apartments: apartments, status: 200});
    } catch (e) {
        console.log(e);
        return ({apartments: "invalid geometry arguments please check longitude,latitude and maxDistance", status: 400})
    }


}
