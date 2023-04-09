const router = require('express').Router();
const { signUp, verifyOtp } = require('../../controllers/otpController/otpController');

router.post('/signup', signUp);
router.post('/signup/verify', verifyOtp);

module.exports = router;