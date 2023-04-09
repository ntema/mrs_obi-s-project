const router = require('express').Router();
const {loginController} = require('../../controllers/authController/loginController');

router.post('/login', loginController )

module.exports = router