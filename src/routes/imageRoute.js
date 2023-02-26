const express = require('express');
const { postImage } = require('../controllers/imageController');
const upload = require('../middlewares/uploadImage');
const imageRoute = express.Router();

imageRoute.post("/", upload.single("file"), postImage)

module.exports = {
    imageRoute
}