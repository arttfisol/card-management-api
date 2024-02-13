const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Card Management API')
})

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
)

module.exports = router
