const Joi = require('joi')

module.exports = {
  create: {
    body: Joi.object({
      picture: Joi.string(),
      name: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required()
    })
  }
}
