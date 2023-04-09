const router = require('express').Router()
const WithdrawalController = require('../../controllers/transactionController/WithdrawalController')
const {verifyToken} = require('../../middlewares/authMiddleware/verifyToken')
const verifyAdminAndUserToken = require('../../middlewares/authMiddleware/verifyUserAndAdmin')

router.put('/withdraw',verifyToken,verifyAdminAndUserToken, WithdrawalController )

module.exports = router