import Joi from "joi";

const exportData = Joi.array().items(
  Joi.object({
    posisi: Joi.string().optional(),
    tanggal_pengajuan: Joi.date().optional(),
    tanggal_selesai: Joi.date().optional(),
    instansi: Joi.string().optional(),
    sort: Joi.valid('Ascending', 'Descending').optional(),
  })
);

export { exportData };