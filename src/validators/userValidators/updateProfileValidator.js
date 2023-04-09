const Joi = require("joi");

const Schema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.number().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  LGA: Joi.string().optional(),

  state: Joi.string().optional(),
  country: Joi.string().optional(),
  about: Joi.string().optional(),
  socialAccounts: Joi.object().optional()
});

module.exports.updateProfileValidator = Schema;
