const Joi = require("joi");

const Schema = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  content: Joi.string().required(),
  property: Joi.string().required()
});

module.exports.newMessageValidator = Schema;
