import Joi from "joi";

const storeDetailProject = Joi.object({
  project_id: Joi.number().required(),
  description: Joi.string().required(),
  status: Joi.valid('proses', 'terima', 'ditolak'),
  percentage: Joi.number().required()
})

const updateDetailProject = Joi.object({
  project_id: Joi.number().optional(),
  description: Joi.string().optional(),
  status: Joi.valid('proses', 'terima', 'ditolak').optional(),
  percentage: Joi.number().optional()
})

export { updateDetailProject, storeDetailProject };