const router = require("express").Router();
const findUserWallet = require("../../controllers/wallet/findUserWallet");
const { verifyToken } = require("../../middlewares/authMiddleware/verifyToken");
const verifyAdminAndUserToken = require("../../middlewares/authMiddleware/verifyUserAndAdmin");

router.get("/single", verifyToken, findUserWallet);

module.exports = router;
