const express = require('express')
const { imageRoute } = require('./imageRoute')
const { userRoute } = require('./userRoute')
const auth = require('../middlewares/auth');

const rootRoute = express.Router()

rootRoute.use("/user", userRoute)
rootRoute.use("/image", auth, imageRoute);

rootRoute.get("/", (req, res) => {
    res.send("Testing")
})

module.exports = {
    rootRoute
}