const Wallet = require("../../models/WalletSchema");
const User = require("../../models/UserSchema");
const axios = require("axios");
const mySecretKey = require("../../config/constants").mySecretKey;

const getUserWalletController = async (req, res, next) => {
  try {
    const user = await User.findOne({_id:req.user._id})
    const user_wallet = await Wallet.findOne({ email:user.email });
    if (user_wallet) {
      var config = {
        method: "GET",
        url: `https://api.flutterwave.com/v3/payout-subaccounts/${user_wallet.account_reference}/balances`,
        // url:`https://api.flutterwave.com/v3/balances/NGN`,
        headers: {
          Authorization: `Bearer ${mySecretKey}`,
        },
      };
      let account_balance = await axios(config);
      const available_balance = account_balance.data.data.available_balance;
      console.log("account_balance ", typeof(parseInt(available_balance, 10)));
      if(account_balance.data.data) {
        const available_balance = account_balance.data.data.available_balance;
        const update_balance = await Wallet.findOneAndUpdate(
          {
            email: user.email,
          },
          {
            $set: {
              amount: available_balance,
            },
          }
        );
        return res.status(200).json(update_balance);
      }
    } else {
      return res.status(400).json({
        status:"error",
        data:"no wallet found"});
    }
  } catch (error) {
    next(error)
  }
};

module.exports = getUserWalletController;
