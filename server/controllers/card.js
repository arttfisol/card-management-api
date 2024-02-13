const mongoose = require('mongoose')
const Card = require('../models/card')
const User = require('../models/user')
const { logs } = require('@fisol3640/utils')
const CardChangeLog = require('../models/card_change_log')

const ObjectId = mongoose.Types.ObjectId
const UPDATABLE_FIELDS = ['topic', 'desc', 'state']

async function load (req, res, next, cardId) {
  try {
    if (!ObjectId.isValid(cardId)) {
      return res.status(404).json({
        message: `Card ${cardId} not found`
      })
    }

    const card = await Card.getById(cardId)
    if (!card) {
      return res.status(404).json({
        message: `Card ${cardId} not found`
      })
    }
    req.card = card
    next()
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

async function get (req, res, next) {
  try {
    return res.json({
      card: req.card
    })
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

async function list (req, res, next) {
  try {
    const { skip = 0, limit = 10 } = req.query
    const { total, cards } = await Card.list({ skip, limit })

    await User.convertCreatedBy(cards)
    return res.json({
      skip,
      limit,
      total,
      cards
    })
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

async function create (req, res, next) {
  try {
    const { topic, desc, state = 'todo' } = req.body
    const body = {
      desc,
      topic,
      state,
      is_archived: false,
      created_by: req.user._id,
      created_time: new Date(),
      updated_time: new Date()
    }

    const card = await new Card(body).save()
    return res.json({
      card
    })
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

async function update (req, res, next) {
  try {
    const body = req.body

    const logs = []
    const updatedTime = new Date()
    for (const field in body) {
      if (UPDATABLE_FIELDS.includes(field)) {
        logs.push({
          field,
          card_id: req.card._id,
          created_by: req.user._id,
          created_time: updatedTime,
          new_value: body[field] || null,
          old_value: req.card[field] || null
        })
        req.card[field] = body[field]
      }
    }

    if (logs.length) {
      req.card.updated_time = updatedTime
      await req.card.save()
      await Promise.all(logs.map(log => new CardChangeLog(log).save()))
    }

    return res.json({
      card: req.card
    })
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

async function archive (req, res, next) {
  try {
    req.card.is_archived = true
    await req.card.save()
    return res.json({
      card: req.card
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
  archive
}
