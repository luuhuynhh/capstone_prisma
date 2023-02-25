const express = require('express');
const { resgister } = require('../controllers/userController');

const userRoute = express.Router();

userRoute.post('/', resgister);

module.exports = {
    userRoute
}