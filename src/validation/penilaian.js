import Joi from "joi";

const storePenilaian = Joi.array().items(
  Joi.object({
    evaluation_name: Joi.string().required().max(100).messages({
      'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter'
    }),
    evaluation_type: Joi.string().valid('personal','competence').required(),
    value: Joi.number().required(),
    pengajuan_id: Joi.number().required()
  })
);

const updatePenilaian = Joi.array().items(
  Joi.object({
    evaluation_name: Joi.string().required().max(100).messages({
      'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter'
    }),
    evaluation_type: Joi.string().valid('personal','competence').required(),
    value: Joi.number().required(),
    pengajuan_id: Joi.number().required(),
    id: Joi.number().required()
  })
);

export { storePenilaian, updatePenilaian };
