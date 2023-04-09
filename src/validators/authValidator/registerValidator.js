const Joi = require("joi");

const Schema = Joi.object({
  email: Joi.string().required(),
  username: Joi.string().required(),
  phone: Joi.string().required(),
  referral: Joi.string().optional(),
  password: Joi.string().required(),
});

module.exports.registerValidator = Schema;
