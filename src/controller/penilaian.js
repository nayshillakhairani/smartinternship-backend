import penilaian from "../service/penilaian.js";
import { validate } from "../validation/validation.js";
import { updatePenilaian, storePenilaian } from "../validation/penilaian.js";

export default class Penilaian {
  static get = async (req, res, next) => {
    try {
      const result = await penilaian.get(req);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getAllMentees = async (req, res, next) => {
    try {
      const result = await penilaian.getAllMentees(req);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Mentees",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getDetail = async (req, res, next) => {
    try {
      const result = await penilaian.getDetail(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Detail Data Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getTemplate = async (req, res, next) => {
    try {
      const result = await penilaian.getTemplate(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Template Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static update = async (req, res, next) => {    
    try {
      let data = validate(updatePenilaian, req.body)
    
      const result = await penilaian.update(data, req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Merubah Data Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static store = async (req, res, next) => {    
    try {
      let data = validate(storePenilaian, req.body)
   
      const result = await penilaian.store(data, req.file);
      return res.status(200).json({
        status: true,
        message: "Berhasil Menambahkan Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static destroy = async (req, res, next) => {    
    try {
    
      const result = await penilaian.destroy(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Menghapus Penilaian",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  } 
}