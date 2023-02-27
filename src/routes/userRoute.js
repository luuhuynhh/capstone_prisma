const express = require('express');
const { resgister, signin, logout, uploadAvatar, getUserDetail, updateUserDetail } = require('../controllers/userController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/uploadImage');

const userRoute = express.Router();

userRoute.post('/', resgister);
userRoute.post('/signin', signin);
userRoute.post('/logout', auth, logout);
userRoute.put('/upload-avatar', auth, upload.single('file'), uploadAvatar);
userRoute.get('/:user_id', getUserDetail);
userRoute.put('/:user_id', auth, updateUserDetail);

module.exports = {
    userRoute
}