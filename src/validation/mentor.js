import Joi from 'joi';

const createMentor = Joi.object({
  name: Joi.string().required().max(100).messages({
    'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter'
  }),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(255).required().messages({
    'string.min': 'Password harus memiliki minimal 8 karakter',
    'string.max': 'Panjang password maksimal 255 karakter',
  }),
  posisi_id: Joi.number().required(),

});

const updateMentor = Joi.object({
  activation: Joi.boolean().required(),
});

const updateMentee = Joi.object({
  mentor_id: Joi.number().required(),
});

export { createMentor, updateMentor, updateMentee };

