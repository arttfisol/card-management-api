const express = require('express')
const validator = require('../validators')
const commentRoute = require('../routes/comment')
const cardValidator = require('../validators/card')
const cardChangeRoute = require('./card_change_log')
const cardController = require('../controllers/card')

const router = express.Router()

router.route('/')
  .get(validator(cardValidator.list), cardController.list)
  .post(validator(cardValidator.create), cardController.create)

router.route('/:card_id')
  .get(validator(cardValidator.get), cardController.get)
  .patch(validator(cardValidator.update), cardController.update)

router.route('/:card_id/archive')
  .post(cardController.archive)

router.use('/:card_id/comments', commentRoute)
router.use('/:card_id/change_logs', cardChangeRoute)

router.param('card_id', cardController.load)

module.exports = router
