import Joi from "joi";

const createProject = Joi.object({
  pengajuan_id: Joi.number().required(),
  title: Joi.string().max(100).required().messages({
    'string.max': 'Panjang judul tidak boleh melebihi 100 karakter.'
  }),
});

const updateProject = Joi.object({
  pengajuan_id: Joi.number().optional(),
  title: Joi.string().max(100).optional().messages({
    'string.max': 'Panjang judul tidak boleh melebihi 100 karakter.'
  }),
});

export { createProject, updateProject };
