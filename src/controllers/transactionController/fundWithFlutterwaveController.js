const flutterwave = require("../../config/flutterwave");
const path = require("path");
const Transaction = require("../../models/TransactionSchema");
const Wallet = require("../../models/WalletSchema");
const Joi = require("joi");
const _ = require("lodash");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const mySecretKey = require("../../config/constants").mySecretKey;
const User = require("../../models/UserSchema");
const {
  verify_bvn,
  create_user_subaccount,
} = require("../../config/flutterwave.js")();
const { v4: uuidv4 } = require("uuid");
const Schedule = require("../../models/schedule")

const Schema = Joi.object({
  // account_number: Joi.string().required(),
  // account_bank: Joi.string().required(),
  amount: Joi.number().required(),
  // narration: Joi.string().required(),
  // currency: Joi.string().required(),
  // debit_subaccount: Joi.string().required(),
  kind: Joi.string().valid("funding", "withdraw", "saving").required(),
  // email: Joi.string().email().required(),
  
});
module.exports.schedule_due_transfer = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const wallet = await Wallet.findOne({ email: user.email });
    const schedules = await Schedule.find({ email: user.email });
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
        error: { message: error.details[0].message }
      });
    }
    /*fetching wallet balance from flutterwave
      var config = {
        method: "GET",
        url: `https://api.flutterwave.com/v3/payout-subaccounts/${wallet.account_reference}/balances`,
        // url:`https://api.flutterwave.com/v3/balances/NGN`,
        headers: {
          Authorization: `Bearer ${mySecretKey}`,
        },
      };
      let account_balance = await axios(config);
      

      console.log("account_balance ", account_balance.data.data)
      if (!account_balance) {
        return res.status(400).json({
          status: "error",
          message: "error fetching wallet balance",
        });
      }
      */
    if (wallet.amount < value.amount) {
      return res.status(400).json({
        status: "error",
        message: "insufficient balance in wallet",
      });
    }
    /*axios api call to iniiate flutterwave transfer

        const data = JSON.stringify({
          account_number: value.account_number,
          account_bank: value.account_bank,
          amount: value.amount,
          narration: value.narration,
          currency: "NGN",
          debit_subaccount: wallet.account_reference,
        });
        var config = {
          method: "post",
          url: "https://api.flutterwave.com/v3/transfers",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mySecretKey}`,
          },
          data: data
        };
        const response_body = await axios(config);
        console.log(response_body.data);
        */
    const transaction_data = {
      amount: value.amount,
      kind: value.kind,
      txf_reference: uuidv4(),
      email: user.email,
      full_name: user.firstName + " " + user.lastName,
      status: "success",
      description: value.narration,
    };
    for (let schedule of schedules) {
      console.log(schedule);
      if (value.kind === "withdraw" && schedule.isFulfilled === true) {
        const response_body = await Wallet.findOneAndUpdate(
          { email: user.email },
          {
            $inc: {
              schedulled_funds: -value.amount,
            },
          },
          { new: true }
        );
        if (!response_body) {
          return res.status(400).json({
            status: "error",
            message: "unable to initiate transfer",
          });
        }
        const trans = await Transaction.create(transaction_data);
        console.log(response_body);
        if (trans) {
          return res.status(200).json({
            status: "success",
            data: trans,
            wallet: response_body,
          });
        }
      }
    }
  } catch (e) {
    next(e);
  }
};
module.exports.initiate_transfer = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const wallet = await Wallet.findOne({email: user.email})
    const schedules = await Schedule.find({email:user.email})
    if (user.isVerified === false) {
      return res.status(400).json({
        error: {
          message: "Please verify your bvn before you can carry out transaction",
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
    /*fetching wallet balance from flutterwave
      var config = {
        method: "GET",
        url: `https://api.flutterwave.com/v3/payout-subaccounts/${wallet.account_reference}/balances`,
        // url:`https://api.flutterwave.com/v3/balances/NGN`,
        headers: {
          Authorization: `Bearer ${mySecretKey}`,
        },
      };
      let account_balance = await axios(config);
      

      console.log("account_balance ", account_balance.data.data)
      if (!account_balance) {
        return res.status(400).json({
          status: "error",
          message: "error fetching wallet balance",
        });
      }
      */
    if (wallet.amount < value.amount) {
      return res.status(400).json({
        status: "error",
        message: "insufficient balance in wallet",
      });
    }
    /*axios api call to iniiate flutterwave transfer

        const data = JSON.stringify({
          account_number: value.account_number,
          account_bank: value.account_bank,
          amount: value.amount,
          narration: value.narration,
          currency: "NGN",
          debit_subaccount: wallet.account_reference,
        });
        var config = {
          method: "post",
          url: "https://api.flutterwave.com/v3/transfers",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mySecretKey}`,
          },
          data: data
        };
        const response_body = await axios(config);
        console.log(response_body.data);
        */
    const transaction_data = {
      amount: value.amount,
      kind: value.kind,
      txf_reference: uuidv4(),
      email: user.email,
      full_name: user.firstName + " " + user.lastName,
      status: "success",
      description: value.narration,
    };
    for (let schedule of schedules) {
      console.log(schedule);
      if (value.kind === "withdraw" && schedule.isFulfilled === true) {
        const response_body = await Wallet.findOneAndUpdate(
          { email: user.email },
          {
            $inc: {
              schedulled_funds: -value.amount,
            },
          },
          { new: true }
        );
        if (!response_body) {
          return res.status(400).json({
            status: "error",
            message: "unable to initiate transfer",
          });
        }
        const trans = await Transaction.create(transaction_data);
        console.log(response_body);
        if (trans) {
          return res.status(200).json({
            status: "success",
            data: trans,
            wallet: response_body,
          });
        }
      }
      }
  } catch (e) {
    next(e);
  }
};
module.exports.L2L_transfer = async (req, res, next) => {
  const Schema = Joi.object({
    recipient_id: Joi.string().required(),
    amount: Joi.number().required(),
    narration: Joi.string().optional(),
    kind: Joi.string().valid("funding", "withdraw", "saving").required(),
  });
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
    if (wallet.amount < value.amount) {
      return res.status(400).json({
        status: "error",
        message: "insufficient balance in wallet",
      });
    }
    const validate_recipient = await Wallet.findOne({_id:value.recipient_id})
    if(!validate_recipient) {
      return res.status(400).json({
        status: "error",
        message: "invalid recipient id",
      });
    }
    const transaction_data = {
      amount: value.amount,
      kind: value.kind,
      txf_reference: uuidv4(),
      email: user.email,
      full_name: user.firstName + " " + user.lastName,
      status: "success",
      description: value.narration,
    };
    if(value.kind === "withdraw") {
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
           { _id: value.recipient_id },
           {
             $inc: {
               amount: value.amount,
             },
           },
           { new: true }
         );
         if(recipient_response_body) {
          const trans = await Transaction.create(transaction_data);
          if (trans) {
            return res.status(200).json({
              status: "success",
              data: trans,
              wallet: response_body,
            });
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
module.exports.retry_failed_transfer = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (user.isVerified === false) {
      return res.status(400).json({
        error: {
          message:
            "Please verify your bvn before you can carry out transaction",
        },
      });
    } else {
      const Schema = Joi.object({
        transaction_id: Joi.string().required()
      })
      const { body } = req;
      const { error, value } = Schema.validate(body);
      if (error) {
        return res.status(400).json({
          error: { message: error.details[0].message },
        });
      }
      // const data = value.transaction_id;
      // const response_body = await create_user_subaccount(data);
      var config = {
        method: "post",
        url: `https://api.flutterwave.com/v3/transfers/${value.transaction_id}/retries`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mySecretKey}`,
        },
        data: value.transaction_id,
      };
      const response_body = await axios(config);
      console.log(response_body);
      if (response_body) {
        return res.status(200).json({
          status: "success",
          data: response_body.data,
        });
      }
    }
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
};

module.exports.get_all_transfers = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (user.isVerified === false) {
      return res.status(400).json({
        error: {
          message:
            "Please verify your bvn before you can carry out transaction",
        },
      });
    } else {
      var config = {
        method: "get",
        url: `https://api.flutterwave.com/v3/transfers`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mySecretKey}`,
        },
      };
      const response_body = await axios(config);
      console.log(response_body);
      if (response_body) {
        return res.status(200).json({
          status: "success",
          data: response_body.data,
        });
      }
    }
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
};
module.exports.get_a_transfer = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (user.isVerified === false) {
      return res.status(400).json({
        error: {
          message:
            "Please verify your bvn before you can carry out transaction",
        },
      });
    } else {
      const Schema = Joi.object({
        transaction_id: Joi.string().required(),
      });
      const { body } = req;
      const { error, value } = Schema.validate(body);
      if (error) {
        return res.status(400).json({
          error: { message: error.details[0].message },
        });
      }
      // const data = value.transaction_id;
      // const response_body = await create_user_subaccount(data);
      var config = {
        method: "get",
        url: `https://api.flutterwave.com/v3/transfers/${value.transaction_id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mySecretKey}`,
        },
      };
      const response_body = await axios(config);
      console.log(response_body);
      if (response_body) {
        return res.status(200).json({
          status: "success",
          data: response_body.data,
        });
      }
    }
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
};
module.exports.get_a_failed_transfer = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (user.isVerified === false) {
      return res.status(400).json({
        error: {
          message:
            "Please verify your bvn before you can carry out transaction",
        },
      });
    } else {
      const Schema = Joi.object({
        transaction_id: Joi.string().required(),
      });
      const { body } = req;
      const { error, value } = Schema.validate(body);
      if (error) {
        return res.status(400).json({
          error: { message: error.details[0].message },
        });
      }
      // const data = value.transaction_id;
      // const response_body = await create_user_subaccount(data);
      var config = {
        method: "get",
        url: `https://api.flutterwave.com/v3/transfers/${value.transaction_id}/retries`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mySecretKey}`,
        },
      };
      const response_body = await axios(config);
      console.log(response_body);
      if (response_body) {
        return res.status(200).json({
          status: "success",
          data: response_body.data,
        });
      }
    }
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
};
module.exports.verify_transaction = async (req, res) => {
  try {
    let response_body = {};
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
      // response_body = await verifyPayment(reference);
      var config = {
          method: "get",
          url: `https://api.flutterwave.com/v3/transactions/${reference}/verify`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mySecretKey}`,
          },
        };
        const response_body = await axios(config);
        console.log(response);
      console.log(response_body.data);
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
            { $set: { status: "success" } },
            { new: true }
          );
        }
        if (
          transaction_response &&
          transaction_response.status === "success" &&
          transaction_response.kind === "funding"
        ) {
          console.log("ref_1 ", reference);
          console.log("ref_2 ", transaction_response.reference);
          //  ee.once("event", async () => {

          //  });
          await Wallet.findOneAndUpdate(
            { owned_by: user._id },
            { $inc: { amount: amount } },
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
          redirect_url: `localhost:3000/api/v1/transaction/receipt/${transaction._id}`,
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
      return res.status(400).json({
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
module.exports.transaction_webhook = async (req, res, next) => {
  try {
    if (req.method === "GET") {
      //ensure user is verified via bvn verification
      const user = await User.findOne({ _id: req.user.id });
      if (user.isVerified === false) {
        return res.status(400).json({
          error: {
            message: "bvn not verified",
          },
        });
      }
      //verify webhook source
      const signature = req.headers["verif-hash"];
      const secretHash = "secretHash";
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(secretHash, salt);
      if (req.headers && req.headers["verif-hash"]) {
        const decrypted_secret_hash = await bcrypt.compare(
          secretHash,
          signature
        );
        if (!signature || signature !== decrypted_secret_hash) {
          return res.status(401).json({
            message: "error",
            data: "wrong signature",
          });
        }
      } else {
        //retrieve transaction payload of verified webhook
        
        const payload = req.body;
        // payload.on("data", function (chunk) {
        //   console.log(chunk)
        // });

        console.log(payload);
        //verify that transaction
        let config = {
          method: "get",
          url: `https://api.flutterwave.com/v3/transactions/:id/verify`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mySecretKey}`,
          },
        };
        const response = await axios(config);
        console.log(response);
        //save that transaction if successfully verified
        if (response) {
          const transaction = await Transaction.create(response.data.data);
          return res.status(200).json({
            message: "success",
            response,
            payload,
          });
        }
      }
    } else if (req.method === "POST") {
      const user = await User.findOne({ _id: req.user._id });
      if (user.isVerified === false) {
        return res.status(400).json({
          error: {
            message: "bvn not verified",
          },
        });
      }
      const signature = req.headers["verif-hash"];
      const secretHash = "secretHash";
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(secretHash, salt);
      if (req.headers && req.headers["verif-hash"]) {
        const decrypted_secret_hash = await bcrypt.compare(
          secretHash,
          signature
        );
        if (!signature || signature !== decrypted_secret_hash) {
          console.log("signature ", signature);
          return res.status(401).json({
            message: "error",
            data: "wrong signature",
          });
        }
      } else {        
        const payload = req.body;
        // payload.on("data", function (chunk) {
        //   console.log(chunk)
        // });
        console.log(payload);
        var config = {
          method: "get",
          url: `https://api.flutterwave.com/v3/transactions/:id/verify`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mySecretKey}`,
          },
        };
        const response = await axios(config);
        console.log(response);
        if (response) {
          const transaction = await Transaction.create(response.data.data);
          return res.status(200).json({
            message: "success",
            response,
            payload,
            transaction
          });
        } else {
          // var config = {
          //   method: "post",
          //   url: `https://api.flutterwave.com/v3/transactions/${payload.data.id}/resend-hook`,
          //   headers: {
          //     "Content-Type": "application/json",
          //     Authorization: `Bearer ${mySecretKey}`,
          //   },
          //   user_data: response.data.data.id,
          // };
          // const resend_failed_webhook = await axios(config);
          // console.log(resend_failed_webhook);
        }
      }
    }
    
  } catch (error) {
    next(error)
  }
};