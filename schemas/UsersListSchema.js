const Joi = require('joi');

const usersListSchema = Joi.object({
  page: Joi.number().required(),
  per_page: Joi.number().required(),
  total: Joi.number().required(),
  total_pages: Joi.number().required(),
  data: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
      email: Joi.string().email().required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      avatar: Joi.string().uri().required()
    })
  ).required(),
  support: Joi.object({
    url: Joi.string().uri().required(),
    text: Joi.string().required()
  }).required()
});

module.exports = usersListSchema;
