import Joi from "joi";

const createPosisi = Joi.object({
  nama: Joi.string().max(100).required().messages({
    'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter',
    'string.empty': 'Nama harus diisi!',
    'any.required': 'Nama harus diisi!',
  }),
  kuota: Joi.number().required().messages({
    'number.base': 'Kuota harus diisi!',
    'any.required': 'Kuota harus diisi!',
  }),
  prasyarat: Joi.string().required().messages({
    'string.empty': 'Persyaratan harus diisi!',
    'any.required': 'Persyaratan harus diisi!',
  }),
  deskripsi: Joi.string().required().messages({
    'string.empty': 'Deskripsi harus diisi!',
    'any.required': 'Deskripsi harus diisi!',
  }),
});

const updatePosisi = Joi.object({
  nama: Joi.string().max(100).optional().messages({
    'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter',
    'string.empty': 'Nama harus diisi!',
  }),
  kuota: Joi.number().optional().messages({
    'number.base': 'Kuota harus diisi!',
  }),
  prasyarat: Joi.string().optional().messages({
    'string.empty': 'Persyaratan harus diisi!',
  }),
  deskripsi: Joi.string().optional().messages({
    'string.empty': 'Deskripsi harus diisi!',
  }),

});

const updateHidePosisi = Joi.object({
  is_active: Joi.boolean().required(),
  status: Joi.string().valid('publish', 'unpublish'),
});

export { createPosisi, updatePosisi, updateHidePosisi };
