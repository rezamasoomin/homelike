const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {port , testPort} =require('./config/index')
const loadre=require('./loader/mongoDB');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


const router=require('./routes/index');
app.use('/api',router);



// start server
const server = app.listen(process.env.NODE_ENV === 'production' ? port : testPort , function () {
    console.log('Server listening on port ' + port);
});
