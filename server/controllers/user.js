const User = require('../models/user')
const { logs } = require('@fisol3640/utils')

async function create (req, res, next) {
  try {
    const { username, password, name, picture } = req.body
    const isDup = await User.getByUsername(username)
    if (isDup) {
      return res.status(409).json({
        message: 'Duplicate User'
      })
    }

    const body = {
      name,
      picture,
      username,
      password,
      created_time: new Date(),
      updated_time: new Date()
    }

    const user = await new User(body).save()
    return res.json({
      user: user.lean()
    })
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

module.exports = {
  create
}
