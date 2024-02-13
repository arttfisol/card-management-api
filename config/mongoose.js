const config = require('./config')
const mongoose = require('mongoose')
const { logs } = require('@fisol3640/utils')

class Mongoose {
  async initial () {
    await mongoose.connect(config.mongoHost)
    logs.info('Mongo Connected')
  }

  async disconnect () {
    return mongoose.disconnect()
  }
}

module.exports = new Mongoose()
