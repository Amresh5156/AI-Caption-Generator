const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth.middleware')

router.post('/',
    authMiddleware)

module.exports = router