import Joi from "joi";

const updateDetailProject = Joi.object({
  status: Joi.valid('proses', 'diterima', 'revisi').required(),
  revision_note: Joi.string().when('status', {
    is: 'revisi',
    then: Joi.required()
  })
});

export { updateDetailProject };
