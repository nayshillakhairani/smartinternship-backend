import express from "express";
import Middleware from "../middleware/auth-middleware.js";
import CmsArtikel from "../controller/cms_artikel.js";
import storage from "../utils/storage.js";

const router = express.Router();

router.get("/articles", CmsArtikel.get);
router.get("/article/:id", CmsArtikel.getDetail);
router.get("/article/slug/:slug", CmsArtikel.getDetailSlug);
router.put(
  "/article/:id", 
  Middleware.authMiddleware, 
  Middleware.permission("ubah_cms_artikel"),
  storage.cmsartikel.single("thumbnail"),
  CmsArtikel.update
);
router.post(
  "/article", 
  Middleware.authMiddleware, 
  Middleware.permission("tambah_cms_artikel"),
  storage.cmsartikel.single("thumbnail"),
  CmsArtikel.store
);
router.delete(
  "/article/:id",
  Middleware.authMiddleware, 
  Middleware.permission("tambah_cms_artikel"), 
  CmsArtikel.destroy
)

export default router;