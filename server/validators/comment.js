const Joi = require('joi')

module.exports = {
  list: {
    params: Joi.object({
      card_id: Joi.string().required()
    }),
    query: Joi.object({
      skip: Joi.number().default(0),
      limit: Joi.number().default(10)
    })
  },
  create: {
    params: Joi.object({
      card_id: Joi.string().required()
    }),
    body: Joi.object({
      desc: Joi.string().required()
    })
  },
  get: {
    params: Joi.object({
      card_id: Joi.string().required(),
      comment_id: Joi.string().required()
    })
  },
  update: {
    params: Joi.object({
      card_id: Joi.string().required(),
      comment_id: Joi.string().required()
    }),
    body: Joi.object({
      desc: Joi.string()
    })
  },
  remove: {
    params: Joi.object({
      card_id: Joi.string().required(),
      comment_id: Joi.string().required()
    })
  }
}
