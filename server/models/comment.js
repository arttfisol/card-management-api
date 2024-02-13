const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  card_id: {
    type: String,
    require: true
  },
  desc: {
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
  }
})

CommentSchema.statics = {
  async list ({ query = {}, skip = 0, limit = 10 }) {
    const total = await this.find(query).count()
    const comments = await this.find(query)
      .sort({ created_time: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return { total, comments }
  },

  async getById (id) {
    return this.findById(id)
  },

  async removeDoc (id) {
    return this.findByIdAndDelete(id)
  }
}

module.exports = mongoose.model('comment', CommentSchema)
