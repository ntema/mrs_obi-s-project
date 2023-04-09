const User = require("../../models/UserSchema");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const constants = require("../../config/constants");

const Schema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
module.exports.loginController = async function (req, res, next) {
  try {
    const { error, value } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message },
      });
    }
    const user = await User.findOne({ email: value.email }).select("+password");
    if (!user) {
      return res.status(400).json({
        error: { message: "Invalid email or password" },
      });
    }
    const isPassword = await bcrypt.compare(value.password, user.password);
    if (isPassword === false) {
      return res.status(400).json({
        error: { message: "Invalid email or password" },
      });
    }
    if(user.role ==='admin') {
      function AddHours(date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
      }
      const date = new Date();
      const newDate = AddHours(date, 25);
      const token = user.generateAdminJWT()
      return res.status(200).json({
        message: "login successful",
        token,
        token_generation_time: new Date() + "",
        token_expiration_time: newDate,
        user,
      });
    } else {
      function AddHours(date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
      }
      const date = new Date();
      const newDate = AddHours(date, 25);

      const token = jwt.sign({ _id: user._id }, constants.TOKEN_SECRET, {
        expiresIn: constants.TOKEN_EXPIRATION_TIME
      });
      return res.status(200).json({
        message: "login successful",
        token,
        token_generation_time: new Date() + "",
        token_expiration_time: newDate,
        user        
      });
    }
  } catch (error) {
    next();
  }
};