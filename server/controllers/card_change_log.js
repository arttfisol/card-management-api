const User = require('../models/user')
const { logs } = require('@fisol3640/utils')
const CardChangeLog = require('../models/card_change_log')

async function list (req, res, next) {
  try {
    const { skip = 0, limit = 10 } = req.query
    const { total, card_change_logs: logs } = await CardChangeLog.list({ skip, limit })

    await User.convertCreatedBy(logs)
    return res.json({
      skip,
      limit,
      total,
      card_change_logs: logs
    })
  } catch (err) {
    logs.error(err.message)
    next(err)
  }
}

module.exports = {
  list
}
