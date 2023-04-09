const router = require('express').Router()
const updateUserController = require('../../controllers/userController/updateUserController')
const {verifyToken} = require('../../middlewares/authMiddleware/verifyToken')
const verifyAdminAndUserToken = require('../../middlewares/authMiddleware/verifyUserAndAdmin')

router.put('/update',verifyToken, updateUserController )

module.exports = router