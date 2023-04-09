const Joi = require("joi");

const Schema = Joi.object({
  email: Joi.string().required(),
  // access_code: Joi.string().required(),
});

module.exports.changePasswordValidator = Schema;
