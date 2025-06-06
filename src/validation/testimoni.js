import Joi from 'joi';

const createTestimoni = Joi.object({
  content: Joi.string().required(),
});

const updateTestimoni = Joi.object({
  status: Joi.string().required().valid('proses','diterima', 'dipublish', 'unpublish')
});

export { createTestimoni, updateTestimoni };
