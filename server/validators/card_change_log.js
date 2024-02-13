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
  }
}
