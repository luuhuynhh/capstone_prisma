const express = require('express');
const { postImage, getImageList, getImageDetail, getImageListSaved, deleteImage } = require('../controllers/imageController');
const upload = require('../middlewares/uploadImage');
const imageRoute = express.Router();

imageRoute.post("/", upload.single("file"), postImage)
imageRoute.get("/", getImageList)
imageRoute.get("/image-saved", getImageListSaved)
imageRoute.get("/:image_id", getImageDetail)
imageRoute.delete("/:image_id", deleteImage)

module.exports = {
    imageRoute
}