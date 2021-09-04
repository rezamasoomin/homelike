const {Schema, model} = require('mongoose');
const apartmentModel = require('./apartmentModel');


const FavoriteSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'user', required: [true, "user is required!"], unique: true},
    apartments: [{type: Schema.Types.ObjectId, ref: 'apartment'}],
}, {
    timestamps: true
});


FavoriteSchema.pre("save", function (next) {
    let apartmentId = this.apartments.slice(-1)[0];
    apartmentModel.findById(apartmentId).then(function (apartment) {
        if (!apartment) return next("apartment not found!");
        next()
    })
});
FavoriteSchema.pre("findOneAndUpdate", function (next) {

    let apartmentId = this['_update']['$push']['apartments'];

    apartmentModel.findById(apartmentId).then(function (apartment) {
        if (!apartment) return next({message:"apartment not found!",status:404});
        next()
    })
});



model('favorite', FavoriteSchema);


module.exports = model('favorite');
