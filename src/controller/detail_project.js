import detailProject from "../service/detail_project.js";

export default class DetailProject {
  static get = async (req, res, next) => {
    try {
      const result = await detailProject.get(req);
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
      const result = await detailProject.getDetail(req.params.id);
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
    
      const result = await detailProject.update(req, req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Merubah Data Detail Project",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static store = async (req, res, next) => {    
    try {
   
      const result = await detailProject.store(req);
      return res.status(200).json({
        status: true,
        message: "Berhasil Menambahkan Data Detail Project",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static destroy = async (req, res, next) => {    
    try {
    
      const result = await detailProject.destroy(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Menghapus Data Detail Project",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  } 
}