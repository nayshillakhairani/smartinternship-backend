import userService from "../service/user.js";

export default class User {
  static updateUser = async (req, res, next) => {
    try {
      const result = await userService.updateUser(req);

      return res.status(200).json({
        status: result,
        message: "update data user sukses",
      });
    } catch (error) {
      next(error);
    }
  };

  static updateAdmin = async (req, res, next) => {
    try {
      const result = await userService.updateAdmin(req.user.id, req.body);

      return res.status(200).json({
        status: result,
        message: "update data admin sukses",
      });
    } catch (error) {
      next(error);
    }
  };

  static uploadSurat = async (req, res, next) => {
    try {
      const result = await userService.uploadSurat(req);

      return res.status(200).json({
        status: result,
        message: "Upload Surat Berhasil",
      });
    } catch (error) {
      next(error);
    }
  };

  static uploadCv = async (req, res, next) => {
    try {
      const result = await userService.uploadCv(req);

      return res.status(200).json({
        status: result,
        message: "Upload Cv Berhasil",
      });
    } catch (error) {
      next(error);
    }
  };
  
  static uploadImage = async (req, res, next) => {
    try {
      const result = await userService.uploadImage(req);

      return res.status(200).json({
        status: result,
        message: "Upload Foto Profile Berhasil",
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllUser = async (req, res, next) => {
    try {
      const result = await userService.getAll();
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data user",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req, res, next) => {
    try {
      const result = await userService.getById(req.params.id);
      return res.status(200).json({
        status: true,
        message: "sukses mendapatkan data user",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteByid = async (req, res, next) => {
    try {
      await userService.deleteById(req.user.id);
      return res.status(200).json({
        status: true,
        message: "hapus data user sukses",
      });
    } catch (error) {
      next(error);
    }
  };

  static changePassword = async (req, res, next) => {
    try {
      const result = await userService.changePassword(req);
      return res.status(200).json({
        status: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
