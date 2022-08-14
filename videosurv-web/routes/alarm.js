const express = require('express')
const { handleAlarm } = require('../controllers/videos')
const { checkCredentials } = require('../middleware/auth')
const router = express.Router()

router.post('/',checkCredentials,handleAlarm)


module.exports = router