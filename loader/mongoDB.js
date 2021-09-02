const mongoose = require('mongoose');
const {databaseURL, dbName} = require('../config/index');
const options = {
    autoIndex: false, // Don't build indexes
    useNewUrlParser: true,
};
let db;
if (process.env.NODE_ENV === 'production' ? true : false) {
    db = mongoose.connect(databaseURL + dbName, options);
    db.Promise = global.Promise;
}else{
    console.log("start mongo db for test")
    const testSetup = require('../loader/testSetup').setupDB();

}

//console.log(db);
mongoose.connection.on("connected", function (ref) {
    console.log("Connected to " + dbName + " DB!");
});
mongoose.connection.on("error", function (err) {
    console.error('Failed to connect to DB' + dbName + 'on startup', err);
});
mongoose.connection.on('disconnected', function () {
   // console.log('Mongoose default connection to DB :' + dbName + ' disconnected');
});
const gracefulExit = function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection with DB :' + dbName + ' is disconnected through app termination');
        process.exit(0);
    });
};
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
module.exports = mongoose;
