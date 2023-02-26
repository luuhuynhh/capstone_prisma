const express = require('express');
const { postImage, getImageList, getImageDetail } = require('../controllers/imageController');
const upload = require('../middlewares/uploadImage');
const imageRoute = express.Router();

imageRoute.post("/", upload.single("file"), postImage)
imageRoute.get("/", getImageList)
imageRoute.get("/:image_id", getImageDetail)

module.exports = {
    imageRoute
}