const router = require('express').Router()
const {initializePayment, verifyPayment,transaction_response} = require('../../controllers/transactionController/fundWithPaystackController')
const { verifyBVN } = require('../../controllers/transactionController/verifyBVN')
const {verifyToken} = require('../../middlewares/authMiddleware/verifyToken')
const verifyAdminAndUserToken = require('../../middlewares/authMiddleware/verifyUserAndAdmin')

router.post('/verifyBVN',verifyToken, verifyBVN )
router.post('/transaction/initialize',verifyToken, initializePayment )
router.get('/paystack/callback',verifyToken, verifyPayment )
router.get('/receipt/:id',verifyToken, transaction_response )


module.exports = router