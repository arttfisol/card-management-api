const _ = require('lodash')
const mongoose = require('mongoose')
const CryptoJS = require('crypto-js')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String
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

/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  this.salt = this.makeSalt(16)
  this.password = this.encryptPassword(this.password, this.salt)
  return next()
})

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @return {String}
   */
  makeSalt (byteSize) {
    if (!byteSize || typeof byteSize !== 'number' || byteSize < 0) {
      byteSize = 16
    }

    return CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(16))
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @return {Boolean}
   * @api public
   */
  authenticate (password) {
    return this.password === this.encryptPassword(password)
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   */
  encryptPassword (password, salt) {
    const _salt = salt || this.salt
    if (!password || !_salt) {
      throw Error('password and salt are needed')
    }

    return CryptoJS.enc.Base64.stringify(CryptoJS.PBKDF2(password, _salt, { keySize: 16, iterations: 1000, hasher: CryptoJS.algo.SHA256.create() }))
  },

  /**
   * Lean data
   *
   * @return {Array.<{ name: string, picture: string, username: string, created_time: Date }>}
   */
  lean () {
    return {
      name: this.name,
      picture: this.picture,
      username: this.username,
      created_time: this.created_time
    }
  }
}

/**
 * Statics
 */
UserSchema.statics = {
  async getByUsername (username) {
    return this.findOne({ username })
  },

  async getById (id) {
    return this.findById(id)
  },

  /**
   * Convert Created By - convert created_by (in term of ID to {name, picture})
   *
   * @param {Array.<Ojbect>} docs - Array of document that have field created_by
   */
  async convertCreatedBy (docs) {
    const userIds = []
    for (const doc of docs) {
      !userIds.includes(doc.created_by) && userIds.push(doc.created_by)
    }

    const users = await this.find({ _id: { $in: userIds } })
    const userMap = {}
    for (const user of users) {
      userMap[user._id] = user
    }

    docs.forEach(doc => {
      doc.created_by = {
        name: _.get(userMap, [doc.created_by, 'name'], 'Unknown'),
        picture: _.get(userMap, [doc.created_by, 'picture'], null),
        username: _.get(userMap, [doc.created_by, 'username'], 'Unknown')
      }
    })
  }
}

module.exports = mongoose.model('user', UserSchema)
