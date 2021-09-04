const favoriteModel = require('../models/favoriteModel');

module.exports = {
    addNewFavorite,
    getFavoriteList
};


async function addNewFavorite(apartmentId, userId) {

    try {

        let favorite = await favoriteModel.findOne({user: userId});

        if (favorite) {
            let newFavorite = await favoriteModel.findOneAndUpdate({user: userId}, { $push: { apartments: apartmentId } });
            return ({favorite: newFavorite, status: 200});
        } else {

            let newFavorite = await favoriteModel.create({user: userId, apartments: [apartmentId]});
            return ({favorite: newFavorite, status: 200});

        }


    } catch (e) {
        return ({favorite: e.message, status: e.status?e.status:400})
    }

}


async function getFavoriteList(userId) {

    try {
        let favoriteList = await favoriteModel.find({user: userId});
        if (!favoriteList.length) return ({favoriteList: favoriteList, status: 404});

        return ({favoriteList: favoriteList, status: 200});
    } catch (e) {
        return ({favoriteList: e.message, status: 400})
    }
}
