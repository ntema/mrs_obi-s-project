const Joi = require("joi");

const Schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

module.exports.loginValidator = Schema;
