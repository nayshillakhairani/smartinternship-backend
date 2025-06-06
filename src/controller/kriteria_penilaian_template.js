import kriteriaPenilaian from "../service/kriteria_penilaian_template.js";
import { validate } from "../validation/validation.js";
import { updateKriteriaPenilaianTemplate, createKriteriaPenilaianTemplate } from "../validation/kriteria_penilaian_template.js";

export default class KriteriaPenilaian {
  static get = async (req, res, next) => {
    try {
      const result = await kriteriaPenilaian.get(req);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Kriteria Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getDetail = async (req, res, next) => {
    try {
      const result = await kriteriaPenilaian.getDetail(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Detail Data Kriteria Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static update = async (req, res, next) => {    
    try {
      let data = validate(updateKriteriaPenilaianTemplate, req.body)
    
      const result = await kriteriaPenilaian.update(data, req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Merubah Data Kriteria Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static store = async (req, res, next) => {    
    try {
      let data = validate(createKriteriaPenilaianTemplate, req.body)
   
      const result = await kriteriaPenilaian.store(data);
      return res.status(200).json({
        status: true,
        message: "Berhasil Menambahkan Kriteria Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}