const router = require('express').Router()
const getAllUserController = require('../../controllers/userController/getAllUserController')
const {verifyToken,verifyAdminToken} = require('../../middlewares/authMiddleware/verifyToken')
const verifyAdmin = require('../../middlewares/authMiddleware/verifyAdmin')

router.get('/all',verifyToken,/*verifyAdmin,*/ getAllUserController )

module.exports = router