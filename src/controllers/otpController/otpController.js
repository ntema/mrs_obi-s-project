const bcrypt = require("bcryptjs");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require('otp-generator');
const nodemailer = require("nodemailer")
const  User  = require('../../models/UserSchema');
const { Otp } = require('../../models/otpModel');
const dotenv = require("dotenv").config();
const Joi = require("joi");
const Schema = Joi.object({
  email: Joi.string().email({minDomainSegments:2}).required(),
});
module.exports.signUp = async (req, res, next) => {
    try {
      const { error, value } = Schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: { message: error.details[0].message },
        });
      }
        const user = await User.findOne({
          email: value.email,
        });
        if (user)
          return res.status(400).json({
            message: `There is an account with this email. Please use a different email!`,
          });
        const OTP = otpGenerator.generate(6, {
          digits: true,
          alphabets: false,
        });
        console.log(OTP);
        let mailTransporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PASS
          },
        });
        let details = {
          from: process.env.MAIL,
          to: value.email || "emmanuelntekim000@gmail.com",
          subject: "OTP access code",
          text: `Your email verification OTP is ${OTP}. It expires in 5 minutes`,
        };
        await mailTransporter.sendMail(details);
        const otp = new Otp({ email: value.email, otp: OTP });
        const salt = await bcrypt.genSalt(10);
        otp.otp = await bcrypt.hash(otp.otp, salt);
        const result = await otp.save();
        return res.status(200).json({
          message: `Otp sent successfully to your mail and will expire in 5 minutes. Contact us at ${
            require("../../config/constants").MAIL
          } if you're experiencing difficulty `,
        });
    } catch (error) {
        next(error)
    }
}
module.exports.verifyOtp = async (req, res, next) => {
    try {
        const otpHolder = await Otp.find({
          number: req.body.email,
        });
        if (otpHolder.length === 0 || otpHolder === null)
          return res.status(400).json({ message: "You used an Expired OTP!" });
        const rightOtpFind = otpHolder[otpHolder.length - 1];
        const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
        if (rightOtpFind.email === req.body.email && validUser) {
          const user = new User(_.pick(req.body, ["email"]));
          const result = await user.save();
          const OTPDelete = await Otp.deleteMany({
            email: rightOtpFind.email,
          });
          return res.status(200).json({
            message: "User Verification Successfull!",
            data: result,
          });
        } else {
          return res.status(400).json("Your OTP was wrong!");
        }

    }catch (e) {
        next(error)
    }
}
