const router = require('express').Router()
const deleteUserController = require('../../controllers/userController/deleteUserController')
const {verifyAdminToken} = require('../../middlewares/authMiddleware/verifyToken')
const verifyAdmin = require('../../middlewares/authMiddleware/verifyAdmin')
// const verifyAdminAndUserToken = require('../../middlewares/authMiddleware/verifyUserAndAdmin')

router.delete('/delete',verifyAdminToken,verifyAdmin, deleteUserController )

module.exports = router