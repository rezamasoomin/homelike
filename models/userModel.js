const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');


let emailValidator = (email) => {
    let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase())
};


const UserSchema = new Schema({
    name: {type: String, required: [true, "name is required!"]},
    email: {
        type: String,
        unique: true,
        validate: {
            validator: emailValidator,
            message: 'Email validation failed'
        },
        required: [true, "email is required!"]

    },
    password: {type: String, required: [true, "password is required!"]}
}, {
    timestamps: true
});


UserSchema.pre("save", function (next) {
    let user = this;
    this.email = this.email.toLowerCase();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next()
        })
    })


});

model('user', UserSchema);


module.exports = model('user');
