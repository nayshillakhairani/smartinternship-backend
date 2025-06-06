import Joi from "joi";

const createAksesManager = Joi.array().items(
  Joi.object({
    role_id: Joi.number().required(),
    permission_id: Joi.number().required(),
  })
);

const updateAksesManager = Joi.array().items(
  Joi.object({
    role_id: Joi.number().required(),
    permission_id: Joi.number().required(),
  })
);

const createRole = Joi.object({
  name: Joi.string().required(),
});

export { createAksesManager, updateAksesManager, createRole };