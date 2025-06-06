import mentorService from '../service/mentor.js';
import { validate } from "../validation/validation.js";
import { createMentor, updateMentor, updateMentee } from "../validation/mentor.js";

export default class Mentor {
  static create = async (req, res, next) => {
    try {
      let data = validate(createMentor, req.body)

      const result = await mentorService.create(req, data);
      return res.status(201).json({
        status: true,
        message: "Berhasil Menambahkan Mentor",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAll = async (req, res, next) => {
    try {
      const result = await mentorService.getAll();
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Mentor",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static updateMentor = async (req, res, next) => {
    try {
      let data = validate(updateMentor, req.body)

      const result = await mentorService.updateMentor(req.params.id, data);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mengubah Data Mentor",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static deleteMentor = async (req, res, next) => {
    try {
      const result = await mentorService.deleteMentor(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mengubah Data Mentor",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getAllMentee = async (req, res, next) => {
    try {
      const result = await mentorService.getAllMentee(req);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Mentee",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getAllUser = async (req, res, next) => {
    try {
      const result = await mentorService.getAllUser();
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data User",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static updateMentee = async (req, res, next) => {
    try {
      let data = validate(updateMentee, req.body)

      const result = await mentorService.updateMentee(data, req.params.mentee_id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data User",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static deleteMentee = async (req, res, next) => {
    try {
      const result = await mentorService.deleteMentee(req.body, req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Menghapus Mentee",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getAllDashboard = async (req, res, next) => {
    try {
      const result = await mentorService.getAllDashboard(req);
      return res.status(200).json({
        status: true,
        message: 'sukses mendapatkan data dashboard mentor',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
