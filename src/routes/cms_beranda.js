import express from "express";
import cms_beranda from "../controller/cms_beranda.js";
import Middleware from "../middleware/auth-middleware.js";
import CmsBeranda from "../controller/cms_beranda.js";
import storage from "../utils/storage.js";

const router = express.Router();

router.get("/homepages", CmsBeranda.get);
router.get("/homepages/:id", CmsBeranda.getDetail);
router.put(
  "/homepages/:id", 
  Middleware.authMiddleware, 
  Middleware.permission("ubah_cms_beranda"),
  storage.cmsberanda.single("image"),
  CmsBeranda.update
);
router.post(
  "/homepages", 
  Middleware.authMiddleware, 
  Middleware.permission("tambah_cms_beranda"), 
  storage.cmsberanda.single("image"),
  CmsBeranda.store
);
router.delete(
  "/homepages/:id",
  Middleware.authMiddleware, 
  Middleware.permission("tambah_cms_beranda"), 
  CmsBeranda.destroy
)

export default router;