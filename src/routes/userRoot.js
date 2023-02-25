const express = require('express');
const { resgister, signin, logout } = require('../controllers/userController');
const auth = require('../middlewares/auth');

const userRoute = express.Router();

userRoute.post('/', resgister);
userRoute.post('/signin', signin);
userRoute.post('/logout', auth, logout)

module.exports = {
    userRoute
}