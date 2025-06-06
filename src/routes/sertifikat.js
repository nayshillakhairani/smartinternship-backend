import express from "express";
import Middleware from "../middleware/auth-middleware.js";
import Sertifikat from "../controller/sertifikat.js";

const router = express.Router();

router.get(
  "/sertifikat/generate",
  Middleware.authMiddleware,
  Middleware.permission("lihat_sertifikat"),
  Sertifikat.get
);

router.post(
  "/sertifikat/assign/:id",
  Middleware.authMiddleware,
  Middleware.permission("tambah_sertifikat"),
  Sertifikat.assign
);

router.get(
  "/sertifikat/generate/:id",
  Middleware.authMiddleware,
  Middleware.permission("tambah_sertifikat"),
  Sertifikat.generate
)
  router.delete(
    "/sertifikat/:id_pengajuan",
    Middleware.authMiddleware,
    Middleware.permission("hapus_sertifikat"),
    Sertifikat.destroy
)

export default router;