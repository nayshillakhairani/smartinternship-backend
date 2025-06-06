import dashboardAdminService from '../service/dashboard_admin.js';
import { unlink } from 'fs/promises';
import { exportData } from "../validation/dashboard_admin.js";
import { validate } from "../validation/validation.js";

export default class DashboardAdmin {
  static exportDataAlumni = async (req, res, next) => {
    try {
      const validatedQueryArray = validate(exportData, Object.keys(req.query).map(key => ({ [key]: req.query[key] })));

      const validatedQueryObject = validatedQueryArray.reduce((acc, curr) => {
        const key = Object.keys(curr)[0];
        acc[key] = curr[key];
        return acc;
      }, {});
      
      const result = await dashboardAdminService.exportDataAlumni(validatedQueryObject);

      res.download(result, async (err) => {
        if (err) {
          return next(err);
        }
        try {
          await unlink(result);
        } catch (unlinkErr) {
          next(unlinkErr);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static exportDataAktif = async (req, res, next) => {
    try {
      const validatedQueryArray = validate(exportData, Object.keys(req.query).map(key => ({ [key]: req.query[key] })));

      const validatedQueryObject = validatedQueryArray.reduce((acc, curr) => {
        const key = Object.keys(curr)[0];
        acc[key] = curr[key];
        return acc;
      }, {});

      const result = await dashboardAdminService.exportDataAktif(validatedQueryObject);
      res.download(result, async (err) => {
        if (err) {
          return next(err);
        }
        try {
          await unlink(result);
        } catch (unlinkErr) {
          next(unlinkErr);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static exportDataPendaftar = async (req, res, next) => {
    try {
      const validatedQueryArray = validate(exportData, Object.keys(req.query).map(key => ({ [key]: req.query[key] })));

      const validatedQueryObject = validatedQueryArray.reduce((acc, curr) => {
        const key = Object.keys(curr)[0];
        acc[key] = curr[key];
        return acc;
      }, {});

      const result = await dashboardAdminService.exportDataPendaftar(validatedQueryObject);
      res.download(result, async (err) => {
        if (err) {
          return next(err);
        }
        try {
          await unlink(result);
        } catch (unlinkErr) {
          next(unlinkErr);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static exportDataMentee = async (req, res, next) => {
    try {
      const result = await dashboardAdminService.exportDataMentee(req.params.mentor_id);
      res.download(result, async (err) => {
        if (err) {
          return next(err);
        }
        try {
          await unlink(result);
        } catch (unlinkErr) {
          next(unlinkErr);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static getAllUserActive = async (req, res, next) => {
    try {
      const result = await dashboardAdminService.getAllUserActive(req.query);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data User Active",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getAllUserRegister = async (req, res, next) => {
    try {
      const result = await dashboardAdminService.getAllUserRegister();
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data User Register",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

    static getFilteredUserRegister = async (req, res, next) => {
      try {
        const result = await dashboardAdminService.getFilteredUserRegister(req.query);
        return res.status(200).json({
          status: true,
          message: "Berhasil Mendapatkan Data User Register",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }

  static getGrafikUserRegister = async (req, res, next) => {
    try {
      const result = await dashboardAdminService.getGrafikUserRegister();
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data User Register",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getFilteredUserActive = async (req, res, next) => {
    try {
      const result = await dashboardAdminService.getFilteredUserActive(req.query);
        return res.status(200).json({
          status: true,
          message: "Berhasil Mendapatkan Data User",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }

    static getFilteredAlumni = async (req, res, next) => {
      try {
        const result = await dashboardAdminService.getFilteredAlumni(req.query);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data User",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}