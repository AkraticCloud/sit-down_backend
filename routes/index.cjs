//Router module for handling subroutes

const express = require('express')

const userRoutes = require('./userroutes.js')
const dbRoutes = require('./dbroutes.cjs')
const placesRoutes = require('./placesroutes.cjs')
const aiRoutes = require('./airoutes.cjs')

const router = express.Router()

router.use("/action", dbRoutes)
router.use("/places", placesRoutes)
router.use("/user", userRoutes)
router.use("/ai",aiRoutes)

router.use((req,res) =>{ return res.status(404).send("Invalid endpoint")})

module.exports = router