import Joi from 'joi';

const storeCmsBeranda = Joi.object({
  element: Joi.string().valid('hero', 'about_us', 'features', 'faq', 'footer').required(),
  title: Joi.string().max(255).required().messages({
    'string.max': 'Panjang Judul tidak boleh melebihi {{#limit}} karakter',
    'string.empty': 'Title harus diisi!',
    'any.required': 'Title harus diisi!',
  }),
  parent_id: Joi.number().integer().optional(),
  content: Joi.string().required().messages({
    'string.empty': 'Content harus diisi!',
    'any.required': 'Content harus diisi!',
  }),
  image: Joi.any().when('element', {
    is: 'features',
    then: Joi.required().messages({
      'any.required': 'Image harus diisi!',
    }),
    otherwise: Joi.optional(),
  }),
  email: Joi.any().when('element', {
    is: 'footer',
    then: Joi.string().required().messages({
      'string.empty': 'Email harus diisi!',
      'any.required': 'Email harus diisi!',
    }),
    otherwise: Joi.optional(),
  }),
  phone: Joi.any().when('element', {
    is: 'footer',
    then: Joi.string().required().messages({
      'string.empty': 'Phone harus diisi!',
      'any.required': 'Phone harus diisi!',
    }),
    otherwise: Joi.optional(),
  }),
});

const updateCmsBeranda = Joi.object({
  element: Joi.string().valid('hero', 'about_us', 'features', 'faq', 'footer').required(),
  title: Joi.string().max(255).required().messages({
    'string.max': 'Panjang Judul tidak boleh melebihi {{#limit}} karakter',
    'string.empty': 'Title harus diisi!',
    'any.required': 'Title harus diisi!',
  }),
  parent_id: Joi.number().integer().optional(),
  content: Joi.any().when('element', {
    is: Joi.valid('hero', 'about_us'),
    then: Joi.string().messages({
      'string.empty': 'Content harus diisi!',
    }),
    otherwise: Joi.optional(),
  }),
  image: Joi.optional(),
  email: Joi.any().when('element', {
    is: 'footer',
    then: Joi.string().required().messages({
      'string.empty': 'Email harus diisi!',
      'any.required': 'Email harus diisi!',
    }),
    otherwise: Joi.optional(),
  }),
  phone: Joi.any().when('element', {
    is: 'footer',
    then: Joi.string().required().messages({
      'string.empty': 'Phone harus diisi!',
      'any.required': 'Phone harus diisi!',
    }),
    otherwise: Joi.optional(),
  }),
});

export { updateCmsBeranda, storeCmsBeranda };
