import express from "express";
import posisi from "../controller/posisi.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/posisi", posisi.getAllPosisi);

router.post(
  "/posisi",
  Middleware.authMiddleware,
  Middleware.permission("tambah_posisi"),
  posisi.createPosisi
);

router.get(
  "/admin/posisi",
  Middleware.authMiddleware,
  Middleware.permission("lihat_posisi"),
  posisi.getAllPosisiAdmin
);

router.put(
  "/posisi/hide/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_posisi"),
  posisi.hidePosisi
);

router.get(
  "/posisi/:id",
  Middleware.authMiddleware,
  Middleware.permission("lihat_posisi"),
  posisi.getById
);

router.put(
  "/posisi/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_posisi"),
  posisi.updateByid
);

router.delete(
  "/posisi/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_posisi"),
  posisi.deleteByid
);

export default router;
