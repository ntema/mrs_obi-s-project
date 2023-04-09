const router = require('express').Router()
const creditWalletController = require('../../controllers/transactionController/creditWalletController')
const {verifyToken} = require('../../middlewares/authMiddleware/verifyToken')
const verifyAdminAndUserToken = require('../../middlewares/authMiddleware/verifyUserAndAdmin')

router.post('/credit-wallet',verifyToken, verifyAdminAndUserToken, creditWalletController )

module.exports = router