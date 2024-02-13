const _ = require('lodash')
const cors = require('cors')
const helmet = require('helmet')
const express = require('express')
const compress = require('compression')
const bodyParser = require('body-parser')
const { logs } = require('@fisol3640/utils')
const cookieParser = require('cookie-parser')
const { morgan } = require('@fisol3640/utils')
const methodOverride = require('method-override')
const { rateLimit } = require('express-rate-limit')
const { ValidationError } = require('express-validation')
const config = require('./config')
const routesAPI = require('../server/routes')
const routesHealthCheck = require('../server/routes/health-check')

const app = express()

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
}))

// parse body params and attache them to req.body
app.use(bodyParser.json({
  limit: '40mb'
}))

app.use(bodyParser.urlencoded({
  extended: true
}))

// access log
app.use(morgan)

app.use(cookieParser())
app.use(compress())
app.use(methodOverride())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

app.use((req, res, next) => {
  logs.info(`${req.method} ${req.baseUrl + req.path} requestInfo=${JSON.stringify({ body: req.body, query: req.query, params: req.params })}`)
  next()
})

app.use('/', routesHealthCheck)
app.use('/api', routesAPI)

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    let message = 'Validation Failed'

    if (['development', 'test'].includes(config.env)) {
      message = {}
      _.set(message, 'query', _.get(err, 'details.query', []).map(q => q.message).join(', ') || undefined)
      _.set(message, 'params', _.get(err, 'details.params', []).map(p => p.message).join(', ') || undefined)
      _.set(message, 'body', _.get(err, 'details.body', []).map(b => b.message).join(', ') || undefined)
    }

    return res.status(400).json({
      message
    })
  } else {
    return res.status(err.status || 500).json({
      message: err.message,
      stack: ['development', 'test'].includes(config.env) ? err.stack : {}
    })
  }
})

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status || 500).json({
    message: err.message,
    stack: ['development', 'test'].includes(config.env) ? err.stack : {}
  }))

module.exports = app
