const express = require('express')
const { userRoute } = require('./userRoot')

const rootRoute = express.Router()

rootRoute.use("/user", userRoute)

rootRoute.get("/", (req, res) => {
    res.send("Testing")
})

module.exports = {
    rootRoute
}