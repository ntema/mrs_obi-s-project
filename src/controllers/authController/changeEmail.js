const User = require("../../models/UserSchema");
const { changeEmailValidator } = require("../../validators/authValidator/changeEmailValidator");
const bcrypt = require("bcryptjs");

module.exports.changeEmail = async (req, res, next ) => {
  try {
    const { error, value } = changeEmailValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message }
      });
    }

    let user = req.user;
    const isPassword = await bcrypt.compare(value.password, user.password);
    if (!isPassword) {
      return res.status(400).json({
        error: { status: "fail", message: "Invalid password" }
      });
    }

    const isEmail = value.oldEmail === user.email;
    if (!isEmail) {
      return res.status(400).json({
        error: { status: "fail", message: "Current Email must be correct" }
      });
    }

    await User.findOneAndUpdate(
      { _id: user._id },
      { email: value.newEmail },
      { new: true }
    );

    return res.status(201).json({
      status: "success",
      data: user
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
