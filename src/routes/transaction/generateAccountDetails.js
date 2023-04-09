const router = require('express').Router()
const generate_bank_account = require('../../controllers/transactionController/generate_bank_account')
const {verifyToken} = require('../../middlewares/authMiddleware/verifyToken')
const verifyAdminAndUserToken = require('../../middlewares/authMiddleware/verifyUserAndAdmin')

router.get('/generate_account_details',verifyToken, generate_bank_account )

module.exports = router