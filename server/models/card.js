const mongoose = require('mongoose')

const CardSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  created_time: {
    type: Date,
    required: true
  },
  updated_time: {
    type: Date,
    required: true
  },
  is_archived: {
    type: Boolean,
    default: false
  }
})

CardSchema.statics = {
  async list ({ query = {}, skip = 0, limit = 10 }) {
    const queryPayload = { ...query, is_archived: false }
    const total = await this.find(queryPayload).count()
    const cards = await this.find(queryPayload)
      .sort({ created_time: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return { total, cards }
  },

  async getById (id) {
    return this.findById(id)
  }
}

module.exports = mongoose.model('card', CardSchema)
