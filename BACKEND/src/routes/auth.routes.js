const express = require("express")
const { registerController, loginController, userController, logoutController, meController } = require("../controller/auth.controller")
const { authMiddleware } = require("../middlewares/auth.middleware")

const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)
router.post('/logout', logoutController)
router.get('/user', userController)
router.get('/me', authMiddleware, meController)


module.exports = router