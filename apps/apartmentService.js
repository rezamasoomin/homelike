const apartmentModel = require('../models/apartmentModel');

module.exports = {
    createApartment,
    searchApartment,
    nearestApartment
};


async function createApartment(apartmentParams) {

    try {
        let apartment = await apartmentModel.create(apartmentParams);
        return ({apartment: apartment, status: 201});
    } catch (e) {
        return ({apartment: e.message, status: 400})
    }

}


async function searchApartment(filters) {

    try {
        let apartments = await apartmentModel.find(filters);
        if (!apartments.length) return ({apartments: apartments, status: 404});

        return ({apartments: apartments, status: 200});
    } catch (e) {
        return ({apartments: e.message, status: 400})
    }
}

async function nearestApartment(longitude, latitude) {

}
