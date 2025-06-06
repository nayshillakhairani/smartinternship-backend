import Joi from "joi";

const registerUserValidation = Joi.object({
  name: Joi.string().required().max(100).messages({
    'string.max': 'Panjang nama tidak boleh melebihi 100 karakter'
  }),
  email: Joi.string().email().max(255).required().messages({
    "string.email": "Alamat email tidak valid",
    'string.max': 'Panjang password maksimal 255 karakter',
  }),
  password: Joi.string().min(8).max(255).required().messages({
    "string.min": "Password harus memiliki minimal 8 karakter",
    'string.max': 'Panjang password maksimal 255 karakter',
  }),
  confirmpassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Konfirmasi password harus sesuai dengan password",
  }),
  recaptcha: Joi.boolean().valid(true).required().messages({
    'any.required': 'reCaptcha Wajib Diisi',
    'any.only': 'reCaptcha Wajib Diisi'
  })
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().required().max(100).messages({
    'string.max': 'Panjang {{#label}} tidak boleh melebihi {{#limit}} karakter.'
  }),
  password: Joi.string().required().min(8).max(255).messages({
    'string.max': 'Panjang password maksimal 255 karakter',
    "string.min": "Password harus memiliki minimal 8 karakter",
  }),
});

const changePasswordValidation = Joi.object({
  token: Joi.string().required(),
  new_password: Joi.string().min(8).max(255).required().messages({
    "string.min": "Password harus memiliki minimal 8 karakter",
    'string.max': 'Panjang password tidak boleh melebihi {{#limit}} karakter.'
  }),
  new_confirmpassword: Joi.string()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({
      "any.only": "Konfirmasi password harus sesuai dengan password",
    }),
});

export {
  registerUserValidation,
  loginUserValidation,
  changePasswordValidation,
};
