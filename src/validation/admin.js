import Joi from "joi";

const updateLink = Joi.object({
  status: Joi.string(),
  tanggal_awal: Joi.string(),
  tanggal_akhir: Joi.string(),
  tanggal: Joi.string(),
  link: Joi.string().max(255).messages({
    'string.max': 'Panjang {{#label}} tidak boleh melebihi {{#limit}} karakter.'
  }),
});

const insertTemplate = Joi.object({
  name: Joi.string().required(),
});

const insertTemplatePosisi = Joi.object({
  id: Joi.number().required(),
});

const createAdmin = Joi.object({
  name: Joi.string().required().max(100).messages({
    'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter.'
  }),
  email: Joi.string().email().required().max(100).messages({
    'string.max': 'Panjang {{#label}} tidak boleh melebihi {{#limit}} karakter.'
  }),
  password: Joi.string().min(8).max(255).required().messages({
    "string.min": "Password harus memiliki minimal 8 karakter",
    'string.max': 'Panjang {{#label}} tidak boleh melebihi {{#limit}} karakter.'
  }),
});

const updateAdmin = Joi.object({
  user_id: Joi.number().required(),
  activation: Joi.boolean().required(),
});

const createSertifikat = Joi.object({
  id: Joi.number().required(),
});

export default {
  updateLink,
  insertTemplate,
  insertTemplatePosisi,
  createAdmin,
  updateAdmin,
  createSertifikat,
};
