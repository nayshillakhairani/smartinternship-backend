import sertifikat from "../service/sertifikat_template.js";

export default class DetailProject {
  static get = async (req, res, next) => {
    try {
      const result = await sertifikat.get(req.params);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Template Sertifikat",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static update = async (req, res, next) => {
    try {
    
      const result = await sertifikat.update(req, req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Merubah Data Template Sertifikat",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}