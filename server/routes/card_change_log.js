const express = require('express')
const validator = require('../validators')
const cardChangeLogValidator = require('../validators/card_change_log')
const cardChangeLogController = require('../controllers/card_change_log')

const router = express.Router({
  mergeParams: true
})

router.route('/')
  .get(validator(cardChangeLogValidator.list), cardChangeLogController.list)

module.exports = router
