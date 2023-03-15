const express = require('express')
const { imageRoute } = require('./imageRoute')
const { userRoute } = require('./userRoute')
const auth = require('../middlewares/auth');
const { commentRoute } = require('./commentRoute');
const { saveImageRoute } = require('./saveImageRoute');

const rootRoute = express.Router()

rootRoute.use("/user", userRoute)
rootRoute.use("/image", auth, imageRoute);
rootRoute.use("/comment", auth, commentRoute)
rootRoute.use("/save-image", auth, saveImageRoute)

rootRoute.get("/", (req, res) => {
    res.send("Welcome")
})

module.exports = {
    rootRoute
}