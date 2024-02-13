require('dotenv').config()
const http = require('http')
const app = require('./config/express')
const config = require('./config/config')
const { logs } = require('@fisol3640/utils')
const Mongoose = require('./config/mongoose')
const { GracefulShutdownManager } = require('@moebius/http-graceful-shutdown')

let server
let isShutingDown
let shutdownManager

async function main () {
  logs.info('start instance...')

  try {
    await Promise.all([
      Mongoose.initial()
    ])
    server = http.createServer(app)
    shutdownManager = new GracefulShutdownManager(server)

    // module.parent check is required to support mocha watch
    // src: https://github.com/mochajs/mocha/issues/1912
    if (!module.parent) {
      // listen on port config.port
      server.listen(config.port, () => logs.info(`server started on port ${config.port} (${config.env})`))
    }
  } catch (err) {
    logs.error(err)
    process.exit(0)
  }
}

async function prepareToShutdown () {
  if (isShutingDown) {
    logs.info('Received Duplicate Termination Signal, Ignore.')
    return
  }

  logs.info('Received Termination Signal, Preparing graceful shutdown process..')
  isShutingDown = true

  shutdownManager.terminate(async () => {
    await Promise.all([
      new Promise((resolve) => {
        server.close(() => {
          logs.info('Server closed')
          resolve('Server')
        })
      }),
      Mongoose.disconnect()
    ])

    logs.info('No task left, Graceful shutdown finished!')
    process.exit(0)
  })
}

main()

process.on('SIGINT', prepareToShutdown)
process.on('SIGTERM', prepareToShutdown)

module.exports = app
