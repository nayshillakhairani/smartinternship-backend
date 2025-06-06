import Joi from "joi";

const createKriteriaPenilaianTemplate = Joi.array().items(
  Joi.object({
    position_id: Joi.number().required(),
    evaluation_name: Joi.string().required().max(100).messages({
      'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter'
    }),
    evaluation_type: Joi.string().valid('personal','competence').required(),
  })
);

const updateKriteriaPenilaianTemplate = Joi.array().items(
  Joi.object({
    id: Joi.number().required(),
    evaluation_name: Joi.string().required().max(100).messages({
      'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter'
    }),
    evaluation_type: Joi.string().valid('personal','competence').required(),
  })
);

export { updateKriteriaPenilaianTemplate, createKriteriaPenilaianTemplate };
