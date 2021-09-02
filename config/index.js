const dotenv = require('dotenv');

dotenv.config();


module.exports= {
    port: process.env.PORT,
    testPort: process.env.TEST_PORT,
    databaseURL: process.env.DATABASE_URI,
    dbName:process.env.DATABASE_NAME,
    testDatabaseURL:process.env.TEST_DATABASE_URI,
    testDbName:process.env.TEST_DATABASE_NAME

};
