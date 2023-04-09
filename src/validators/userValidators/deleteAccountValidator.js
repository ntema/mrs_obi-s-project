const Joi = require("joi");

const Schema = Joi.object({
  password: Joi.string().required()
});

module.exports.deleteAccountValidator = Schema;
