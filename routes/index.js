const express = require('express');
const router = express();
const cors = require('cors');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(cors());

module.exports = router;


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


