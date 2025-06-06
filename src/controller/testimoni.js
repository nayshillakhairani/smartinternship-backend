import testimoniService from "../service/testimoni.js";
import { validate } from "../validation/validation.js";
import { createTestimoni, updateTestimoni } from "../validation/testimoni.js";

export default class Testimoni {
  static createTestimoni = async (req, res, next) => {
    try {
      let data = validate(createTestimoni, req.body)

      const result = await testimoniService.create(req, data);
      return res.status(200).json({
        status: true,
        message: "Berhasil Menambahkan Testimoni",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllTestimoni = async (req, res, next) => {
    try {
      const result = await testimoniService.getAll();
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data testimoni",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getDetail = async (req, res, next) => {
    try {
      const result = await testimoniService.getDetail(req);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data detail testimoni",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAlumni = async (req, res, next) => {
    try {
      const result = await testimoniService.getAlumni(req);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data Alumni",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateTestimoni = async (req, res, next) => {
    try {
      const result = await testimoniService.updateTestimoni(req.body, req.params.id);

      return res.status(200).json({
        status: true,
        message: "sukses mengubah data testimoni",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static check = async (req, res, next) => {
    try {
      // let data = validate(updateTestimoni, req.body)

      const result = await testimoniService.check(req);
      return res.status(200).json({
        status: true,
        message: "Berhasil melakukan check testimoni",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
