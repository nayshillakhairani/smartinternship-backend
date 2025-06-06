import aksesManager from '../service/akses_manager.js';
import { validate } from "../validation/validation.js";
import {createRole, updateAksesManager}  from "../validation/akses_manager.js";

export default class AksesManager {
  static getPermissions = async (req, res, next) => {
    try {
      const result = await aksesManager.getPermissions();
      return res.status(200).json({
        status: true,
        message: "Success mendapatkan data permissions",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getRoles = async (req, res, next) => {
    try {
      const result = await aksesManager.getRoles();
      return res.status(200).json({
        status: true,
        message: "Success mendapatkan data roles",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static createRole = async (req, res, next) => {
    try {
      const data = await validate(createRole, req.body)

      const result = await aksesManager.createRole(data);
      return res.status(200).json({
        status: true,
        message: "Success membuat data role",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static get = async (req, res, next) => {
    try {
      const result = await aksesManager.get(req);
      return res.status(200).json({
        status: true,
        message: "Success mendapatkan data akses manager",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static update = async (req, res, next) => {
    try {
      const datas = await validate(updateAksesManager, req.body)

      const result = await aksesManager.update(datas);
      return res.status(200).json({
        status: true,
        message: "Success update data akses manager",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}