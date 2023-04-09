const paystack = require("../../config/paystack");
const path = require("path");
const Transaction = require("../../models/TransactionSchema");
const Wallet = require("../../models/WalletSchema");
const Joi = require("joi");
const _ = require("lodash");
const axios = require("axios");
const User = require("../../models/UserSchema");
const EventEmitter = require("events");
const ee = new EventEmitter()
const { initializePayment, verifyPayment } =
  require("../../config/paystack.js")();

const Schema = Joi.object({
  full_name: Joi.string().required(),
  amount: Joi.number().required(),
  kind: Joi.string().valid('funding','withdraw','saving').required(),
  email: Joi.string().email().required(),
});
module.exports.initializePayment = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (user.isVerified === false) {
      return res
        .status(400)
        .json({
          error: {
            message: "Please verify your bvn before you can fund your wallet",
          },
        });
    } else {
      const { body } = req;
      const { error, value } = Schema.validate(body);
      if (error) {
        return res.status(400).json({
          error: { message: error.details[0].message },
        });
      }
      const data = _.pick(value, ["full_name","kind", "amount", "email"]);
      data.amount *= 100;
      data.metadata = {
        full_name: data.full_name,
        kind: data.kind,
      };
      const response_body = await initializePayment(data);
      return res.status(200).json({
        data: response_body.data,
      });
    }
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    let response_body = {}
    const user = await User.findOne({ _id: req.user._id });
    if (user && user.isVerified === false) {
      return res.status(400).json({
        error: {
          message: "Please verify your bvn before you fund your wallet",
        },
      });
    } else {
      let reference = req.query.reference;
      let transaction_response = {};
      response_body = await verifyPayment(reference);
      console.log(response_body.data)
      console.log("1 ",response_body.data.data.gateway_response);
      console.log("2 ", response_body.data.data.status);
      console.log("2 ", response_body.data.data.reference);
      if (
        response_body.data.data.status !== "success" &&
        response_body.data.data.gateway_response !== "Approved"
      ) {
        return res.status(400).json({
          error: { message: "Transaction not completed" },
        });
      } else {
        let data = _.at(response_body.data, [
          "data.reference",
          "data.amount",
          "data.customer.email",
          "data.metadata.full_name",
        ]);
        [reference, amount, email, full_name] = data;
        amount = amount / 100;
        newTransact = { reference, amount, email, full_name };
        const transaction = new Transaction(newTransact);
        transaction_response = await transaction.save();
        if (transaction_response && transaction_response.status === "pending") {
          transaction_response = await Transaction.findOneAndUpdate(
            { reference },
            { $set: { status: "success"} },
            { new: true }
          );
        }
        if (transaction_response && 
            transaction_response.status === "success" && 
            transaction_response.kind === "funding"
        ) {
          console.log("ref_1 ", reference)
          console.log("ref_2 ", transaction_response.reference);
          //  ee.once("event", async () => {
             
          //  });
          await Wallet.findOneAndUpdate(
            { email: user.email },
            { $inc: { amount : amount } },
            { new: true }
          );
         
        } else {
          return res.status(400).json({
            error: { message: "unverified transaction" },
            redirect_url: `https://node-api-0i99.onrender.com/api/v1/transaction/paystack/callback?reference=${reference}`,
          });
        }
        res.status(200).json({
          success: { message: response_body.data },
          redirect_url: `https://node-api-0i99.onrender.com/api/v1/transaction/receipt/${transaction._id}`,
        });
      }
    } 
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
    console.log(error.message);
  }
};

module.exports.transaction_response = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if ((user.isVerified = false)) {
      return res
        .status(400)
        .json({
          error: {
            message: "Please verify your bvn before you fund your wallet",
          },
        });
    }
    const id = req.params.id;
    const transaction = await Transaction.findById({ _id: id });
    if (!transaction) {
      return res
        .status(400)
        .json({ error: { message: "Transaction not found" } });
    }
    return res.status(200).json({ transaction });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};
