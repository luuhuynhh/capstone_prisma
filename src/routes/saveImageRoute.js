const express = require('express');
const { saveImage, unSaveImage, checkIfSaved } = require('../controllers/saveImageController');
const saveImageRoute = express.Router();

saveImageRoute.post("/", saveImage);
saveImageRoute.post("/un-save", unSaveImage);
saveImageRoute.get("/check-if-saved", checkIfSaved);

module.exports = {
    saveImageRoute
}