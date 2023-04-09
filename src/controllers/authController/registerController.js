const User = require("../../models/UserSchema");
const Wallet = require('../../models/WalletSchema')
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const constants = require("../../config/constants");
const flutterwave = require("../../config/flutterwave");
const { create_virtual_wallet } = require("../../config/flutterwave")();
const axios = require("axios");
const mySecretKey = require("../../config/constants").mySecretKey

const Schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().min(11).max(11).regex(/^([+])?(\d+)$/).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  confirmPassword: Joi.string().equal(Joi.ref("password")).messages({"any.only":"password does not match"}).required(),
});

module.exports = async function (req, res, next) {
  try {
    const { error, value } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    const isUser = await User.findOne({ _id: req.params.id }); 
    if (!isUser) {
      return res.status(400).json({
        error: { message: "This email has not been verified" },
      });
    }
    if(isUser.registration_status === "REGISTERED") {
      return res.status(400).json({
        error: {message: "This user is already registered"}
      })
    }
    if(value.password === value.confirmPassword){
      const salt = await bcrypt.genSalt(12)
      value.password = await bcrypt.hash(value.password, salt);
    }else {
      return res.status(400).json({
        error: { message: "password and confirm password must match" },
      });
    }
    value.registration_status = "REGISTERED";
    const user = await User.findOneAndUpdate(
      {_id: req.params.id},
        value,
      {
        new:true
      })
      if(user) {
        const token = user.generateJWT();
        const walletFind = await Wallet.findOne({email:user.email}) 
        if(walletFind) {
           function AddHours(date, hours) {
             date.setHours(date.getHours() + hours);
             return date;
           }
           const date = new Date();
           const newDate = AddHours(date, 25);
          res.status(200).json({
            status: "Registration successful",
            token,
            token_generation_time: new Date() + "",
            token_expiration_time: newDate,
            wallet: walletFind,
            data: user, 
          });
        } else {
             const my_data = JSON.stringify({
               account_name: user.firstName + " " + user.lastName,
               email: user.email,
               mobilenumber: user.phone,
               country: "NG",
             });
            var config = {
              method: "post",
              // url: "https://api.flutterwave.com/v3/virtual-account-numbers",
              url: "https://api.flutterwave.com/v3/payout-subaccounts",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${mySecretKey}`,
              },
              data: my_data,
            };
          const response = await axios(config);
          console.log(response.data.data)
          if (response.data.data) {
             const wallet_data = {
               id: response.data.data.id,
               account_reference: response.data.data.account_reference,
               account_name: response.data.data.account_name,
               barter_id: response.data.data.barter_id,
               email: response.data.data.email,
               mobilenumber: response.data.data.mobilenumber,
               country: "NG",
               nuban: response.data.data.nuban,
               bank_name: response.data.data.bank_name,
               bank_code: response.data.data.bank_code,
               status: response.data.data.status,
               amount:"0",
             };
            const createWallet = await Wallet.create(wallet_data);
            function AddHours(date, hours) {
              date.setHours(date.getHours() + hours);
              return date;
            }
            const date = new Date();
            const newDate = AddHours(date, 25);
            res.status(200).json({
              status: "Registration successful",
              token,
              token_generation_time: new Date() + "",
              token_expiration_time: newDate,
              wallet: createWallet,
              data: user,
            });
          } else {
            return res.status(400).json({
              status: "Error",
              message: "Error in creating wallet. Please contact admin",
            });
          } 
        }
      } else {
         return res.status(400).json({
           status: "Error",
           message: "Registration Unsuccessful",
         });
      }
  } catch (error) {
    next(error);
    console.log(error.message)
  }
};


