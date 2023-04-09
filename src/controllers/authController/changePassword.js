const User = require("../../models/UserSchema");
const { changePasswordValidator } = require("../../validators/authValidator/changePasswordValidator");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const otpGenerator = require('otp-generator')
const sendEmailToUser = require("../../config/mailSender");
const { Otp } = require('../../models/otpModel');


module.exports.changePassword = async (req, res, next ) => {
  try {
    const { error, value } = changePasswordValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message }
      });
    }
    const isUser = await User.findOne({ email: value.email }).select("+password");
    if (!isUser) {
      return res.status(400).json({
        error: { message: "This email has not been verified" },
      });
    }
    
    const OTP = otpGenerator.generate(6, {
      digits: true, alphabets: false, upperCase: false, specialChars: false});
      console.log(OTP)
    //emails send
    sendEmailToUser({
      tempPath:'public/emails/activation_link.html',
      replacements:{
        lastName: isUser.lastName,
        email: isUser.email,
        firstName:isUser.firstName,
        access_code: OTP 
      },
      mailTo:isUser.email,
      subject:"Reset Your Password"
    })
    const otp = new Otp({ email: value.email, otp:OTP });
    const salt = await bcrypt.genSalt(10)
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    console.log("otp res ",result)
    return res.status(200).json({
        message: `Otp sent successfully to your mail! Expires in 5minutes.
        Contact us at ${require('../../config/constants').MAIL} if you're experiencing difficulty `
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.PasswordReset = async (req, res, next) => {
const Schema = Joi.object({
  access_code: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmNewPassword: Joi.string().required()
});
  try {
    const { error, value } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message }
      });
    }
    const isUser = await User.findById({_id:req.params.id}).select("+password")
    if (!isUser) {
    return res.status(400).json({
      error: { message: "Invalid user" },
    });
    }
    
    //otp verificaion
    const otpHolder = await Otp.find({
      email: isUser.email
  });
  console.log(otpHolder)
  if (otpHolder.length === 0 || otpHolder === null) return res.status(400).json({message: "You used an Expired OTP!"});
  const rightOtpFind = otpHolder[otpHolder.length - 1];
  const validUser = await bcrypt.compare(value.access_code, rightOtpFind.otp);

  if (rightOtpFind.email === isUser.email && validUser) {
    if (value.newPassword !== value.confirmNewPassword) {
      return res.status(400).json({
        error: {
          status: "fail",
          message: "New password and 'Confirm New Password must match'"
        }
      }); 
    }
    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash(value.newPassword, salt);

    const OTPDelete = await Otp.deleteMany({ email: rightOtpFind.email}); 
    const update = await User.findOneAndUpdate({ id: isUser._id }, { password });
    if(update) {
      return res.status(200).json({
        status: "success",
        data: update
      });
    } else {
      return res.status(400).json({
        status: "failed",
        data: "password reset failed, please try again"
      });
    }
  } else {
      return res.status(400).json("Your OTP is wrong!")
  }
  } catch(err) {
    next(err)
  }
}

