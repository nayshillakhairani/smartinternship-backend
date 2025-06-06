import sertifikat from "../service/sertifikat.js";
import { unlink } from "fs/promises";
import ejs from 'ejs';

export default class DetailProject {
  
  static get = async (req, res, next) => {
    try {
      const result = await sertifikat.get(req.params);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Detail Project",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static assign = async (req, res, next) => {
    try {
      const result = await sertifikat.assign(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Berikan Sertifikat",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static generate = async (req, res, next) => {
    try {
      const result = await sertifikat.generate(req.params.id, res);
      res.download(result)
    } catch (error) {
      next(error);
    }
  }

  static destroy = async (req, res, next) => {
    try {
      await sertifikat.destroy(req.params.id_pengajuan);
      return res.status(200).json({
        status: true,
        message: "Berhasil hapus Sertifikat",
      });
    } catch (error) {
      next(error);
    }
  }
}