const Joi = require('joi')

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('production', 'development', 'test')
    .default('development'),
  PORT: Joi.number().required(),
  MONGO_HOST: Joi.string().required(),
  JWT_SECRET: Joi.string().default('secret')

})
  .unknown()
  .required()

const { error, value: envVars } = envVarsSchema.validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error}`)
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoHost: envVars.MONGO_HOST,
  jwtSecret: envVars.JWT_SECRET

}

module.exports = config
