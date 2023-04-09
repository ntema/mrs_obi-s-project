const Wallet = require("../../models/WalletSchema");
const Transaction = require("../../models/TransactionSchema");
const User = require("../../models/UserSchema");
const Schedule = require("../../models/schedule");

const Joi = require("joi");

const Schema = Joi.object({
  amount: Joi.number().required(),
  transaction: Joi.string().required(),
});

module.exports = async function (req, res, next) {
  try {
    const { error, value } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    const user = await User.findOne({ _id: req.user._id });
    if ((user.isVerified = false)) {
      return res.status(400).json({
        error: {
          message: "Please verify your bvn before you fund your wallet",
        },
      });
    }
    const schedule = await Schedule.findOne({_id: req.user._id})
    const creditWallet = await Wallet.findOneAndUpdate(
      { email: user.email },
      { $inc: { amount: value.amount } },
      { new: true }
    );

    const preTransaction = new Transaction({
      amount: value.amount,
      userId: _id,
      reference: value.transaction,
    });
    const transaction = await preTransaction.save();

    return res.status(200).json({ value, creditWallet, transaction });
  } catch (err) {
    next(err);
  }
};
