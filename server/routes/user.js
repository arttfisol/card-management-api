const express = require('express')
const validator = require('../validators')
const userValidator = require('../validators/user')
const userController = require('../controllers/user')

const router = express.Router()

router.route('/')
  .post(validator(userValidator.create), userController.create)

module.exports = router
