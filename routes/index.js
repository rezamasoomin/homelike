const express = require('express');
const router = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const authMiddleWAre = require('../apps/middlewares/authMiddleware');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(cors());

module.exports = router;


//---------------------------[user]---------------------------------------------
const userService = require('../apps/userService');
router.post('/register', async function (req, res, next) {
    let userParams = req.body;
    const {user, status} = await userService.register(userParams);
    user.password = undefined;
    res.status(status).json({message: user});
});
router.post('/authentication', async function (req, res, next) {
    let {email, password} = req.body;
    const {message, status} = await userService.authentication(email, password);

    res.status(status).json({message: message});
});


//---------------------------[apartment]-----------------------------------------------
const apartmentService = require('../apps/apartmentService');

router.post('/createApartment', authMiddleWAre, async function (req, res, next) {
    let apartmentParams = req.body;
    const {apartment, status} = await apartmentService.createApartment(apartmentParams);
    res.status(status).json({message: apartment});

});


router.get('/search', async function (req, res, next) {
    let filters = req.query;
    const {apartments, status} = await apartmentService.searchApartment(filters);
    res.status(status).json({apartments: apartments});

});


router.get('/nearest', async function (req, res, next) {
    let {longitude, latitude} = req.body;
    const {apartments, status} = await apartmentService.nearestApartment(longitude, latitude);
    res.status(status).json({apartments: apartments});

});
