const User = require('../../models/UserSchema')
const Wallet = require("../../models/WalletSchema");
const axios = require("axios");
const MySecretKey = require("../../config/constants").mySecretKey;

module.exports = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user.id });
      const wallet = await Wallet.findOne({ email: user.email });
      if (!user) {
        return res.status(400).json({
          status: "fail",
          data: "invalid user",
        });
      }
      if (user.isVerified === false) {
        return res
          .status(400)
          .json({
            error: {
              message:
                "Please verify your bvn before you generate wallet account number",
            },
          });
      }
      if (user.generatedAccountNumber) {
        return res.status(200).json({
          status: "success",
          data: user.generatedAccountNumber,
          account_name: wallet.account_name,
        });
      } else {
        const account_details = {
          account_number: wallet.nuban,
          bank_name: wallet.bank_name,
          bank_code: wallet.bank_code,
          account_name: wallet.account_name,
        };
        const user_update = await User.findOneAndUpdate(
          { email: user.email },
          {
            $set: {
              generatedAccountNumber: account_details,
            },
          }
        );
        if(user_update) {
          return res.status(200).json({
            status:"success",
            message : user_update.generatedAccountNumber
          })
        } else {
          return res.status(400).json({
            status:"fail",
            message : "unable to generate acxcount details"
          })
        }
      }
    } catch (error) {
      next(error)
    }
}

 