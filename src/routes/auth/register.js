const router = require('express').Router()
const registerController = require('../../controllers/authController/registerController')
const flutterwave = require("../../config/flutterwave");
const { create_virtual_wallet } = require("../../config/flutterwave")();
const axios = require("axios");
const mySecretKey = require("../../config/constants").mySecretKey;
const Joi = require("joi");
const User = require("../../models/UserSchema");
/*
const Schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});
*/
router.post("/register/:id", registerController);

module.exports = router
/*
 async (req, res) => {
  const { error, value } = Schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: { message: error.details[0].message },
    });
  }
  const user = await User.findOne({_id: req.params.id})
  const my_data = JSON.stringify({
    email: user.email,
    phonenumber: value.phone,
    firstname: value.firstName,
    lastname: value.lastName,
    narration: value.firstName + " " + value.lastName,
    amount: "1",
  });
  var config = {
    method: "post",
    url: "https://api.flutterwave.com/v3/virtual-account-numbers",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${mySecretKey}`,
    },
    data: my_data,
  };
  const response = await axios(config);
  console.log(response);
  res.status(200).json(response.data.data);
}
*/
