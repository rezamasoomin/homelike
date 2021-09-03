const apartmentModel=require('../models/apartmentModel');

module.exports={
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

}

async function nearestApartment(longitude,latitude) {

}
