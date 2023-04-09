const router = require("express").Router();
const {
  // create_user_subaccount,
  // verifyPayment,
  transaction_response,
  initiate_transfer,
  transaction_webhook
} = require("../../controllers/transactionController/fundWithFlutterwaveController");
const {
  verifyBVN,
} = require("../../controllers/transactionController/verifyBVN");
const { verifyToken } = require("../../middlewares/authMiddleware/verifyToken");
const verifyAdminAndUserToken = require("../../middlewares/authMiddleware/verifyUserAndAdmin");

router.post("/verifyBVN", verifyToken, verifyBVN);
// router.post(
//   "/transaction/create_subaccount",
//   verifyToken,
//   create_user_subaccount
// );
// router.get("/paystack/callback", verifyToken, verifyPayment);
// router.get("/receipt/:id", verifyToken, transaction_response);
router.post("/myverifyBVN", verifyToken, async (req, res) => {
const axios = require("axios");
const Flutterwave = require("flutterwave-node-v3");
  try {
    const flw = new Flutterwave(
      "FLWPUBK-258b155f0280d14df81574b9ea844c48-X",
      "FLWSECK-39f3e9e851b91068fc45aa9e1014afc1-X"
    );
    const { body } = req;
    const data = await flw.Misc.bvn({ bvn: body.bvn });
    if (!data || data.status === "error") {
      res.status(400).json({
        message: "bvn verification failed. Please try again",
      });
    } else {
      res.status(200).json({
        message: data,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: data,
    });
  }
});

router.post("/transaction_webhook",verifyToken, transaction_webhook);
router.get("/transaction_webhook",verifyToken, transaction_webhook);
router.post("/initiate_transfer", verifyToken, initiate_transfer );


module.exports = router;
