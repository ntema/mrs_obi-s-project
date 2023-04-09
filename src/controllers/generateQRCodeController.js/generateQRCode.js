const { genQRCode } = require("../../config/qrCodeReader");
const User = require("../../models/UserSchema");
const Wallet = require("../../models/WalletSchema");
const Joi = require("joi");

const Schema = Joi.object({
  amount: Joi.number().required(),
});
module.exports.L2L_transfer_via_QRcode = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const wallet = await Wallet.findOne({ email: user.email });
    if (user.isVerified === false) {
      return res.status(400).json({
        error: {
          message:
            "Please verify your bvn before you can carry out transaction",
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
    if (value.amount === null || value.amount === " ") {
      return res.status(400).json({
        status: "error",
        data: "please provide an amount for payment",
      });
    }
    if (wallet.amount < value.amount) {
      return res.status(400).json({
        status: "error",
        message: "insufficient balance in wallet",
      });
    }
    const transaction_data = {
      amount: value.amount,
      kind: "withdraw",
      txf_reference: uuidv4(),
      email: user.email,
      full_name: user.firstName + " " + user.lastName,
      status: "success",
      description: "payment for service",
    };
    if (value.kind === "withdraw") {
      const response_body = await Wallet.findOneAndUpdate(
        { email: user.email },
        {
          $inc: {
            amount: -value.amount,
          },
        },
        { new: true }
      );
      if (!response_body) {
        const recipient_response_body = await Wallet.findOneAndUpdate(
          { email: req.user.email },
          {
            $inc: {
              amount: value.amount,
            },
          },
          { new: true }
        );
        if (recipient_response_body) {
          const trans = await Transaction.create(transaction_data);
          if (trans) {
            const generate_QRcode = genQRCode(value.amount);
            if (generate_QRcode) {
              return res.status(200).json({
                status: "success",
                data: trans,
                wallet: response_body,
              });
            }
          }
        }
      }
    } else {
      return res.status(400).json({
        status: "error",
        message: "this transaction is only allowable for withdrawal",
      });
    }
  } catch (e) {
    next(e);
  }
};
