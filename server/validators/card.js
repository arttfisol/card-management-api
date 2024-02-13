const Joi = require('joi')

module.exports = {
  list: {
    query: Joi.object({
      skip: Joi.number().default(0),
      limit: Joi.number().default(10)
    })
  },
  create: {
    body: Joi.object({
      desc: Joi.string().required(),
      topic: Joi.string().required(),
      state: Joi.string().required().valid('todo', 'in_progress', 'done')
    })
  },
  get: {
    params: Joi.object({
      card_id: Joi.string().required()
    })
  },
  update: {
    params: Joi.object({
      card_id: Joi.string().required()
    }),
    body: Joi.object({
      desc: Joi.string(),
      topic: Joi.string(),
      state: Joi.string().valid('todo', 'in_progress', 'done')
    })
  }
}
