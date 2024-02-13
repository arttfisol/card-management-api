const mongoose = require('mongoose')
const User = require('../models/user')
const Comment = require('../models/comment')
const { logs } = require('@fisol3640/utils')

const UPDATABLE_FIELDS = ['desc']
const ObjectId = mongoose.Types.ObjectId

async function load (req, res, next, commentId) {
  try {
    if (!ObjectId.isValid(commentId)) {
      return res.status(404).json({
        message: `Comment ${commentId} not found`
      })
    }
    const comment = await Comment.getById(commentId)
    if (!comment) {
      return res.status(404).json({
        message: `Comment ${commentId} not found`
      })
    }
    req.comment = comment
    next()
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

async function get (req, res, next) {
  try {
    return res.json({
      comment: req.comment
    })
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

async function list (req, res, next) {
  try {
    const { skip = 0, limit = 10 } = req.query
    const { total, comments } = await Comment.list({ query: { card_id: req.params.card_id }, skip, limit })

    await User.convertCreatedBy(comments)
    return res.json({
      skip,
      limit,
      total,
      comments
    })
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

async function create (req, res, next) {
  try {
    const { desc } = req.body
    const { card_id: cardId } = req.params

    const body = {
      desc,
      card_id: cardId,
      created_by: req.user._id,
      created_time: new Date(),
      updated_time: new Date()
    }

    const comment = await new Comment(body).save()
    return res.json({
      comment
    })
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

async function update (req, res, next) {
  try {
    const body = req.body

    let isUpdate = false
    for (const field in body) {
      if (UPDATABLE_FIELDS.includes(field)) {
        req.comment[field] = body[field]
        isUpdate = true
      }
    }

    if (isUpdate) {
      req.comment.updated_time = new Date()
      await req.comment.save()
    }

    return res.json({
      comment: req.comment
    })
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

async function remove (req, res, next) {
  try {
    await Comment.removeDoc(req.comment._id)
    return res.json({
      comment: req.comment
    })
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

module.exports = {
  load,
  get,
  list,
  create,
  update,
  remove
}
