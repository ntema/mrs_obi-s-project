const router = require("express").Router();
const { verifyToken } = require("../../middlewares/authMiddleware/verifyToken");
const verifyAdminAndUserToken = require("../../middlewares/authMiddleware/verifyUserAndAdmin");
const findAllSchedule = require("../../controllers/scheduleController/findAllSchedule");

router.get("/schedule/pending", verifyToken, addFundingService);

module.exports = router;
