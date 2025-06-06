import Joi from "joi";

const createJurusan = Joi.object({
  name: Joi.string().required().max(100).messages({
    'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter'
  }),
});

const updateJurusan = Joi.object({
  name: Joi.string().max(100).messages({
    'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter'
  }),
});

export { createJurusan, updateJurusan };
