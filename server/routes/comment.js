const express = require('express')
const validator = require('../validators')
const middleware = require('../middlewares/middleware')
const commentValidator = require('../validators/comment')
const commentController = require('../controllers/comment')

const router = express.Router({
  mergeParams: true
})

router.route('/')
  .get(validator(commentValidator.list), commentController.list)
  .post(validator(commentValidator.create), commentController.create)

router.route('/:comment_id')
  .get(validator(commentValidator.get), commentController.get)
  .patch(middleware.isCommentOwner, validator(commentValidator.update), commentController.update)
  .delete(middleware.isCommentOwner, validator(commentValidator.remove), commentController.remove)

router.param('comment_id', commentController.load)

module.exports = router
