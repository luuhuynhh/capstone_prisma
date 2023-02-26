const express = require('express');
const { postImage, getImageList } = require('../controllers/imageController');
const upload = require('../middlewares/uploadImage');
const imageRoute = express.Router();

imageRoute.post("/", upload.single("file"), postImage)
imageRoute.get("/", getImageList)

module.exports = {
    imageRoute
}