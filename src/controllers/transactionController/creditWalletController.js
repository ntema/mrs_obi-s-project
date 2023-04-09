const Wallet = require("../../models/WalletSchema");
const Transaction = require("../../models/TransactionSchema");
const Joi = require("joi");

const Schema = Joi.object({
  amount: Joi.number().required(),
  // transaction: Joi.object().required(),
  transaction: Joi.string().required(),

});

module.exports = async function (req, res, next) {
  try {
    const _id = req.user;
    console.log(_id)
    const { error, value } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    const creditWallet = await Wallet.findOneAndUpdate(
      {owned_by: _id},
      { $inc: { amount: value.amount } },
      { new: true }
    );

    const preTransaction = new Transaction({
      amount: value.amount,
      userId: _id,
      reference: value.transaction,
    });
    const transaction = await preTransaction.save();

    return res.status(200).json({value, creditWallet, transaction });
  } catch (err) {
    next(err);
  }
};
