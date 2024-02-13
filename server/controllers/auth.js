const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../models/user')
const config = require('../../config/config')
const { Strategy: LocalStrategy } = require('passport-local')
const { Strategy: BearerStrategy } = require('passport-http-bearer')

function initial () {
  // local
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  async (username, password, done) => {
    try {
      const user = await User.getByUsername(username)

      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Your username or password is incorrect.'
        })
      }

      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }))

  // bearer
  passport.use(new BearerStrategy(
    async function (token, done) {
      try {
        let data
        try {
          data = jwt.verify(token, config.jwtSecret)
        } catch (err) {
          return done(null, false, {
            message: 'Can\'t Verify Token'
          })
        }

        const user = await User.getById(data.user_id)
        if (!user) {
          return done(null, false, {
            message: 'User Not Found'
          })
        }

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  ))
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))
}

function login (req, res, next) {
  passport.authenticate('local', {
    session: false
  }, function (err, user, info) {
    const error = err || info
    if (error) {
      return res.status(401).json(error)
    }
    if (!user) {
      return res.status(404).json({
        message: 'Something went wrong, please try again.'
      })
    }

    const expiresIn = 60 * 60 * 24
    const accessToken = jwt.sign({
      user_id: user._id
    }, config.jwtSecret, {
      expiresIn
    })

    return res.json({
      expires_in: expiresIn,
      access_token: accessToken
    })
  })(req, res, next)
}

module.exports = {
  login,
  initial
}
