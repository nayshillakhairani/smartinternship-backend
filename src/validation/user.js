import Joi from "joi";

const updateUser = Joi.object({
  periode_id: Joi.number().required().messages({
    'any.required': 'Periode ID harus diisi'
  }),
  name: Joi.string().required().max(100).messages({
    'string.max': 'Panjang nama tidak boleh melebihi {{#limit}} karakter',
    'any.required': 'Nama harus diisi'
  }),
  nim: Joi.string().required().messages({
    'any.required': 'NIM harus diisi'
  }),
  religion: Joi.string().required().messages({
    'any.required': 'Agama harus diisi'
  }),
  gender: Joi.string().required().messages({
    'any.required': 'Jenis kelamin harus diisi'
  }),
  phone: Joi.string().required().messages({
    'any.required': 'Nomor telepon harus diisi'
  }),
  jurusan_id: Joi.number().required().messages({
    'any.required': 'Jurusan ID harus diisi'
  }),
  instansi_id: Joi.number().required().messages({
    'any.required': 'Instansi ID harus diisi'
  }),
  tanggal_pengajuan: Joi.string().required().messages({
    'any.required': 'Tanggal pengajuan harus diisi'
  }),
  tanggal_selesai: Joi.string().required().messages({
    'any.required': 'Tanggal selesai harus diisi'
  }),
  image: Joi.optional(),
});


const changePassword = Joi.object({
  password: Joi.string().required(),
  new_password: Joi.string().min(8).max(255).required().messages({
    "string.min": "Password harus memiliki minimal 8 karakter",
    'string.max': 'Panjang password maksimal 255 karakter',
  }),
  new_confirmpassword: Joi.string()
    .valid(Joi.ref("new_password"))
    .required()
    .max(255)
    .messages({
      "any.only": "Konfirmasi password harus sesuai dengan password",
      'string.max': 'Panjang password maksimal 255 karakter',
    }),
});

export default { updateUser, changePassword };
