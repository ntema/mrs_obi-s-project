const router = require('express').Router()
const {changePassword, PasswordReset} = require('../../controllers/authController/changePassword')
const {verifyToken} = require('../../middlewares/authMiddleware/verifyToken')

router.post('/forgot-password', changePassword )
// router.get('/reset-password/:id/:token', validatePasswordResetLink )
router.post('/reset-password/:id', PasswordReset )

module.exports = router