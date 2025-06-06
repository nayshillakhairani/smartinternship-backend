import posisiService from '../service/posisi.js';
import { validate } from '../validation/validation.js';
import { createPosisi, updatePosisi, updateHidePosisi } from '../validation/posisi.js';

export default class Posisi {
  static createPosisi = async (req, res, next) => {
    try {
      let data = validate(createPosisi, req.body);

      const result = await posisiService.create(data);
      return res.status(200).json({
        status: true,
        message: 'Sukses Menambah Data Posisi',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllPosisi = async (req, res, next) => {
    try {
      const result = await posisiService.getAll(req.query.id);
      return res.status(200).json({
        status: true,
        message: 'sukses mendapatkan data posisi',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllPosisiAdmin = async (req, res, next) => {
    try {
      const result = await posisiService.getAllAdmin(req);
      return res.status(200).json({
        status: true,
        message: 'sukses mendapatkan data posisi',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req, res, next) => {
    try {
      const result = await posisiService.getById(req.params.id);
      return res.status(200).json({
        status: true,
        message: 'sukses mendapatkan data posisi',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static hidePosisi = async (req, res, next) => {
    try {
      const result = await posisiService.hidePosisi(req.body, req.params.id);

      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateByid = async (req, res, next) => {
    try {
      let data = validate(updatePosisi, req.body);

      const result = await posisiService.updateById(data, req.params.id);
      return res.status(200).json({
        status: true,
        message: 'Berhasil Merubah Data Posisi',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteByid = async (req, res, next) => {
    try {
      await posisiService.deleteById(req.params.id);
      return res.status(200).json({
        status: true,
        message: 'hapus data posisi sukses',
      });
    } catch (error) {
      next(error);
    }
  };
}
