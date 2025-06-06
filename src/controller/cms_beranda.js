import cmsBeranda from "../service/cms_beranda.js";
import { validate } from "../validation/validation.js";
import { updateCmsBeranda, storeCmsBeranda } from "../validation/cms_beranda.js";

export default class CmsBeranda {
  static get = async (req, res, next) => {
    try {
      const result = await cmsBeranda.get(req.params);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Beranda",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getDetail = async (req, res, next) => {
    try {
      const result = await cmsBeranda.getDetail(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Detail Data Beranda",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static update = async (req, res, next) => {    
    try {
      req.body.image = req.file
      
      let data = validate(updateCmsBeranda, req.body)
    
      const result = await cmsBeranda.update(data, req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Merubah Data Beranda",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static store = async (req, res, next) => {    
    try {
      req.body.image = req.file

      let data = validate(storeCmsBeranda, req.body)
   
      const result = await cmsBeranda.store(data, req.file);
      return res.status(200).json({
        status: true,
        message: "Berhasil Menambahkan Sub Content Beranda",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static destroy = async (req, res, next) => {    
    try {
    
      const result = await cmsBeranda.destroy(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Menghapus Sub Content Beranda",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  } 
}