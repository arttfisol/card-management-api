const mongoose = require('mongoose')

const CardChangeLogSchema = new mongoose.Schema({
  card_id: {
    type: String,
    require: true
  },
  field: {
    type: String,
    required: true
  },
  old_value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  new_value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  created_time: {
    type: Date,
    required: true
  }
})

CardChangeLogSchema.statics = {
  async list ({ query = {}, skip = 0, limit = 10 }) {
    const total = await this.find(query).count()
    const logs = await this.find(query)
      .sort({ created_time: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return { total, card_change_logs: logs }
  },

  async create ({ field, old_value: oldValue, new_value: newValue, created_by: craetedBy }) {

  }
}

module.exports = mongoose.model('card_change_log', CardChangeLogSchema)
