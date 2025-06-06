import express from "express";
import pengajuan from "../controller/pengajuan.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/pengajuan", Middleware.authMiddleware, Middleware.permission("tambah_pengajuan"),pengajuan.createPengajuan);
router.get("/pengajuan", Middleware.authMiddleware, Middleware.permission("lihat_pengajuan"),pengajuan.getAllPengajuan);
router.get("/pengajuan/:id", Middleware.authMiddleware, Middleware.permission("lihat_pengajuan"), pengajuan.getById);
router.delete(
  "/pengajuan/:id",
  Middleware.authMiddleware,
  Middleware.permission("hapus_pengajuan"),
  pengajuan.deleteByid
);

export default router;
