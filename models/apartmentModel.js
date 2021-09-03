const {Schema, model} = require('mongoose');


const pointSchema = new Schema({
    type: {type: String, enum: ['Point'], required: true},
    coordinates: {type: [Number], required: true}
});

const apartmentSchema = new Schema({
    user: {type:Schema.Types.ObjectId, ref: 'user', required: [true,"user is required!"]},
    title: { type: String, required: [true, "title is required!"]},
    rooms: {type: Number, required: [true, "rooms is required!"]},
    country: {type: String, required: [true, "country is required!"]},
    city: {type: String, required: [true, "country is required!"]},
    location: {type: pointSchema},
}, {
    timestamps: true
});




model('apartment', apartmentSchema);


module.exports = model('apartment');
