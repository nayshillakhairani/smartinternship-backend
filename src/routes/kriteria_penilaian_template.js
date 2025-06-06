import express from "express";
import Middleware from "../middleware/auth-middleware.js";
import KriteriaPenilaian from "../controller/kriteria_penilaian_template.js";

const router = express.Router();

router.get(
  "/template/kriteria-penilaian",
  Middleware.authMiddleware,
  KriteriaPenilaian.get
);
router.get(
  "/template/kriteria-penilaian/:id",
  Middleware.authMiddleware,
  KriteriaPenilaian.getDetail
);
router.put(
  "/template/kriteria-penilaian/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_template"),
  KriteriaPenilaian.update
);
router.post(
  "/template/kriteria-penilaian",
  Middleware.authMiddleware,
  Middleware.permission("tambah_template"),
  KriteriaPenilaian.store
);

export default router;