const express = require('express')
const cardRoute = require('./card')
const userRoute = require('./user')
const authRoute = require('./auth')
const middleware = require('../middlewares/middleware')

const router = express.Router()

router.use('/auth', authRoute)
router.use('/users', userRoute)

router.use('/cards', middleware.bearer(), cardRoute)

module.exports = router
