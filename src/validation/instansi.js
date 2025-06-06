import Joi from "joi";

const createInstansi = Joi.object({
  name: Joi.string().required().max(100).messages({
    'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter'
  }),
  kuota: Joi.number().required(),
});

const updateInstansi = Joi.object({
  name: Joi.string().max(100).messages({
    'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter'
  }),
  kuota: Joi.number().required(),
});

const updateHideInstansi = Joi.object({
  is_active: Joi.boolean().required(),
});

export { createInstansi, updateInstansi, updateHideInstansi };
