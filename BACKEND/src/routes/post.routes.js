const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth.middleware')
const { createPostController } = require('../controller/post.controller')
const multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('image'), createPostController)

module.exports = router;