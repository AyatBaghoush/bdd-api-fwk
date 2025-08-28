const Joi = require('joi');

const userSchema = Joi.object({
  id: Joi.number().required(),
  token: Joi.string().required()
});
module.exports = userSchema;