const router = require("express").Router();
const fundWithUssd = require("../../controllers/transactionController/fundWithUssd");
const { verifyToken } = require("../../middlewares/authMiddleware/verifyToken");
const verifyAdminAndUserToken = require("../../middlewares/authMiddleware/verifyUserAndAdmin");

router.post("/ussd", verifyToken, fundWithUssd);

module.exports = router;
