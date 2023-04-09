const router = require("express").Router();
const { verifyToken } = require("../../middlewares/authMiddleware/verifyToken");
const verifyAdminAndUserToken = require("../../middlewares/authMiddleware/verifyUserAndAdmin");
const addFundingService = require("../../controllers/scheduleController/addScheduleFunds");
const findAllSchedule = require("../../controllers/scheduleController/findAllSchedule");

router.get("/schedule/all", verifyToken, findAllSchedule);
router.post("/schedule",verifyToken, addFundingService);


module.exports = router;
