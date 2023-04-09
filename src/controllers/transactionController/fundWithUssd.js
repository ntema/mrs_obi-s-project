const User = require("../../models/UserSchema");
const Joi = require("joi")
const Schema = Joi.object({
  amount: Joi.number().required(),
});
module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    console.log("1 ", user)
     if (!user) {
       return res.status(400).json({
         status: "fail",
         data: "invalid user",
       });
     }
    if (user.isVerified === "false") {
      return res
        .status(400)
        .json({
          error: {
            message: "Please verify your bvn before you fund your wallet",
          },
        });
    }
    const { body } = req;
    const { error, value } = Schema.validate(body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    const bank_details = {
      //account number for testing
      account_number: 6321947148,
      bank_name: "Fidelity",
      account_name: `${user.firstName}  ${user.lastName}`,
    };
    const user_account = await User.findOne({
      "generatedAccountNumber.account_number": bank_details.account_number,
    });
    if (user_account) {
      let pay_by_ussd = {
        GT_Bank: `*737 * 2 * ${value.amount} * ${bank_details.account_number}#`,
        Zennith_Bank: `*966 * ${value.amount} * ${bank_details.account_number}#`,
        Access_Bank: `*901 * ${value.amount} * ${bank_details.account_number}#`,
        First_Bank: `*894 * ${value.amount} * ${bank_details.account_number}#`,
        Wema_Bank: `*945 * ${value.amount} * ${bank_details.account_number}#`,
        Polaris_Bank: `*833 * ${value.amount} * ${bank_details.account_number}#`,
      };
      return res.status(200).json({
        message: "success",
        data: pay_by_ussd,
      });
    } else {
      return res.status(400).json({
        message: "fail",
        data: "Please generate account number first",
      })
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};
