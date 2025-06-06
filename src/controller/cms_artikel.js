import cmsArtikel from "../service/cms_artikel.js";
import { validate } from "../validation/validation.js";
import { updateCmsArticle, storeCmsArticle } from "../validation/cms_artikel.js";

export default class CmsArtikel {
  static get = async (req, res, next) => {
    try {
      const result = await cmsArtikel.get(req);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Data Artikel",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getDetail = async (req, res, next) => {
    try {
      const result = await cmsArtikel.getDetail(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Detail Data Artikel",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static getDetailSlug = async (req, res, next) => {
    try {
      const result = await cmsArtikel.getDetailSlug(req.params.slug);
      return res.status(200).json({
        status: true,
        message: "Berhasil Mendapatkan Detail Data Artikel",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static update = async (req, res, next) => {    
    try {
      req.body.thumbnail = req.file;
      let data = validate(updateCmsArticle, req.body)
    
      const result = await cmsArtikel.update(data, req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Merubah Data Artikel",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static store = async (req, res, next) => {    
    try {
      req.body.thumbnail = req.file;
      let data = validate(storeCmsArticle, req.body)
   
      const result = await cmsArtikel.store(data);
      return res.status(200).json({
        status: true,
        message: "Berhasil Menambahkan Artikel",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static destroy = async (req, res, next) => {    
    try {
    
      const result = await cmsArtikel.destroy(req.params.id);
      return res.status(200).json({
        status: true,
        message: "Berhasil Menghapus Beranda",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  } 
}