import Joi from "joi";

const storeCmsArticle = Joi.object({
  title: Joi.string().required().max(255).messages({
    'string.empty': 'Judul Wajib diisi!',
    'any.required': 'Judul Wajib diisi!',
    'string.max': 'Panjang Judul tidak boleh melebihi {{#limit}} karakter'
  }),
  slug: Joi.string().optional(),
  content: Joi.required().messages({
    'any.required': 'Content Wajib diisi!',
  }),
  thumbnail: Joi.required().messages({
    'any.required': 'Thumbnail Wajib diisi!',
  }),
})

const updateCmsArticle = Joi.object({
  title: Joi.string().optional().max(255).messages({
    'string.empty': 'Judul harus diisi!',
    'string.max': 'Panjang Judul tidak boleh melebihi {{#limit}} karakter'
  }),
  slug: Joi.string().optional(),
  content: Joi.string().required().messages({
    'string.empty': 'Content harus diisi!',
  }), 
  thumbnail: Joi.optional(),
})

export { updateCmsArticle, storeCmsArticle };