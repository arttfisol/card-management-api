const express = require('express')
const authController = require('../controllers/auth')
authController.initial()

const router = express.Router()

router.use('/login', authController.login)

module.exports = router
