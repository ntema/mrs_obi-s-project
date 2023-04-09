const Schedule = require("../../models/schedule");
const NodeScheduler = require("node-schedule");
const Redis = require("redis");
const User = require("../../models/UserSchema");
const Wallet = require("../../models/WalletSchema");
const Joi = require("joi");
const Schema = Joi.object({
  period: Joi.string().required().valid("daily","weekly","bi-weekly","monthly","yearly"),
  start_date: Joi.date()
    .iso()
    .messages({
      "date.format": "Date format is YYY-MM-DD",
    })
    .required(),
  stop_date: Joi.date()
    .iso()
    .messages({
      "date.format": "Date format is YYY-MM-DD",
      "date.max": `Period must be ${Joi.ref("period")} `,
    })
    .required(),
  schedule_description: Joi.string().required(),
  schedulled_funds: Joi.number().required(),
});
const redisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 90000000;
module.exports = async (req, res, next) => {
  try {
    const { error, value } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details.map(x => x.message )},
      });
    }
    console.log("value ", value)
    const ff = new Intl.DateTimeFormat("en-us", {
      dateStyle:"full",
      timestyle:"full"
    })
    console.log("date: ",ff.format(new Date()))
    const user = await User.findOne({ _id: req.user.id });
    const user_wallet = await Wallet.findOne({ email: user.email });
    if (user && user.isVerified === false) {
      redisClient.setEx("user", DEFAULT_EXPIRATION, JSON.stringify(user))
      return res.status(400).json({
        error: {
          message: "Please verify your BVN",
        },
      });
    }
    if(user_wallet.email = user.email) {
      if (user_wallet && user_wallet.amount === 0) {
              redisClient.setEx(
                "user_wallet",
                DEFAULT_EXPIRATION,
                JSON.stringify(user_wallet)
              );
        return res.status(400).json({
          error: {
            message: "You need to fund your wallet",
          },
        });
      }
      if (user_wallet.amount < value.amount) {
        return res.status(400).json({
          error: {
            message: "Insufficient cash in wallet",
          },
        });
      }
    }
    const newFundSchedule = new Schedule( value );
    const saveFundSchedule = await newFundSchedule.save();
    if (saveFundSchedule) {
       const wallet_update = await Wallet.findOneAndUpdate(
         { email: user.email },
         {
           $inc: {
             amount: -value.schedulled_funds,
             schedulled_funds: value.schedulled_funds,
           },
         },
         { new: true }
       );
     return res.status(200).json({
        response: {
          status: "success",
          message: "Fund schedule set successfully",
          data: saveFundSchedule,
          wallet_update,
        },
      });
    } else {
       return res.status(400).json({
         response: {
           status: "error",
           message: "Fund schedule set unsuccessfully",
           data: saveFundSchedule,
           wallet_update,
         },
       });
    }
  } catch (error) {
    next(error)
  }
};
