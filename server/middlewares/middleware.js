const passport = require('passport')

function bearer () {
  return passport.authenticate('bearer', { session: false })
}

function isCommentOwner (req, res, next) {
  if (req.comment.created_by !== req.user._id.toString()) {
    return res.status(401).json({
      message: 'You\'re not allowed to do this action'
    })
  }
  next()
}

module.exports = {
  bearer,
  isCommentOwner
}
