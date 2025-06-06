import monitoring from "../service/monitoring.js";

export default class DetailProject {
  static get = async (req, res, next) => {
    try {
      const result = await monitoring.get(req);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Detail Project",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getDetail = async (req, res, next) => {
    try {
      const result = await monitoring.getDetail(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Detail Project",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static update = async (req, res, next) => {    
    try {
    
      const result = await monitoring.update(req, req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Merubah Data Detail Project",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}