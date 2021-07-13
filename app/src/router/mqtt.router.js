const express = require('express')
const router = express.Router()
const controlMqtt = require('../controller/uploadMqtt.controller')

router.post('/pubData', controlMqtt.pubdata)
router.get('/oke', controlMqtt.result)

module.exports = router