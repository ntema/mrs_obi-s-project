/*
const path = require("path");
const Joi = require("joi");
const _ = require("lodash");
const axios = require("axios");
const User = require("../../models/UserSchema");
const Flutterwave = require("flutterwave-node-v3");

const Schema = Joi.object({
  bvn: Joi.string().required(),
});



// bvn verification with flutter
const flw = new Flutterwave(
  "FLWPUBK_TEST-e34497ef29292714fad6951bf9967f9a-X",
  "FLWSECK_TEST-b36ea03908d88361fcc92998c7fec9c6-X"
);
module.exports.verifyBVN = async (req, res) => {
  try {
    
    const user = await User.findOne({ _id: req.user.id });
    console.log(user._id)
    if(!user) {
      return res
        .status(400)
        .json({ error: { message: "invalid user. Please sign in" } })
    }
    console.log(user);
    if (user.isVerified === true) {
      return res
        .status(400)
        .json({ error: { message: "BVN already verified" } });
    }
    const { body } = req;
    const { error, value } = Schema.validate(body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
      const response_body = await flw.Misc.bvn({ bvn: value.bvn })
      console.log("bvn", response_body)
    if (response_body.status !== "error" && 
        response_body.data !== null
    ){
      isVerified = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $set: {
            isVerified: "true",
          },
        },
        {
          new: true,
        }
      );
    } else {
        return res.status(400).json({
          data: response_body,
        });
    }
    if (isVerified) {
      return res.status(200).json({
        data: isVerified,
      });
    }
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
};
*/


// bvn verification with paystack
const paystack = require('../../config/paystack')
const path = require('path')
const {verifyBVN} = require('../../config/paystack')()
const Joi = require('joi')
const _ = require('lodash')
const axios = require('axios')
const User = require("../../models/UserSchema")
const Wallet = require("../../models/WalletSchema");

const Schema = Joi.object({
    // first_name : Joi.string().required(),
    // last_name : Joi.string().required(),
    // middle_name : Joi.string().required(),
    // account_number : Joi.string().required(),
    bvn : Joi.string().required(),
    // bank_code : Joi.string().required(),   
})
module.exports.verifyBVN = async(req, res, next) => {
    try {
       let isVerified = {};
       const user = await User.findOne({ _id: req.user._id });
       const wallet = await Wallet.findOne({email : user.email})
       console.log(user);
       if (user.isVerified === true) {
         return res
           .status(400)
           .json({ error: { message: "BVN already verified" } });
       }
       const { body } = req;
       const { error, value } = Schema.validate(body);
       if (error) {
         return res.status(400).json({
           error: { message: error.details[0].message },
         });
       }
       value.first_name = user.firstName
       value.last_name = user.lastName
       value.account_number = "6321947148";
       value.bank_code = "070"
        /*
       const response_body = await verifyBVN(JSON.stringify(value));
        console.log("got-here 2");
       if(response_body.status !== 200) {
         return res.status(400).json({
            status:"error",
           data: "unable to validate bvn. Please contact support if this persist",
         });
       }
       */
      if(value.bvn.length !== 11) {
        return res.status(400).json({
          status:"error",
          data: "invalid bvn"
        });
      }

       if (value.bvn) {
           isVerified = await User.findOneAndUpdate(
             { _id: req.user._id },
             {
               $set: {
                 isVerified: "true",
                 bvn: value.bvn,
               },
             },
             {
               new: true,
             }
           );
         if (isVerified) {
           return res.status(200).json({
             status:"success",
             data: "verificaton successful",
           });
         }
        }
      
       /*
         const MySecretKey = `Bearer sk_test_f41c902e0875807ec12d3436f5810aed4c76d089`;
          const url = "https://api.paystack.co/bvn/match";
          const options = {
            headers: {
              Authorization: MySecretKey,
            },
          };
          const user_data = JSON.stringify({
            bvn: value.bvn,
            first_name: user.firstName,
            last_name: user.lastName,
            account_number: "6321947148",
            bank_code: "070",
          });
          console.log("user_data ", user_data)
          const response_body = await axios.post(url, user_data, options); 
               
       console.log(response_body.data)
       if (
         response_body.message !== "BVN lookup successful" &&
         response_body.data.first_name !== user.firstName &&
         response_body.data.last_name !== user.lastName
       ) {
         return res.status(400).json({
           message: "failed",
           data: "Your registration details does not match your bvn details",
         });
       } else {
        //  if (response_body) {
           isVerified = await User.findOneAndUpdate(
             { _id: req.user._id },
             {
               $set: {
                 isVerified: "true",
                 bvn: value.bvn,
               },
             },
             {
               new: true,
             }
           );
        //  }
         if (isVerified) {
           return res.status(200).json({
             data: isVerified.isVerified,
           });
         }
       }
       */

    } catch (e) {
      next(e)
    }
}
