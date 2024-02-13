const { validate } = require('express-validation')

module.exports = (schema) => validate(schema, { context: true }, { allowUnknown: true, abortEarly: false })
