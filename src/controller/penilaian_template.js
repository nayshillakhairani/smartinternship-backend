import penilaian from "../service/penilaian_template.js";

export default class DetailProject {
  static get = async (req, res, next) => {
    try {
      const result = await penilaian.get(req.params);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Template Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static update = async (req, res, next) => {
    try {
    
      const result = await penilaian.update(req, req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Merubah Data Template Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}