import express from "express";
import instansi from "../controller/instansi.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post(
  "/instansi",
  Middleware.authMiddleware,
  Middleware.permission("tambah_mitra"),
  instansi.createInstansi
);

router.get(
  "/instansi",
  Middleware.authMiddleware,
  Middleware.permission("lihat_mitra"),
  instansi.getAllInstansi
);

router.get(
  "/instansi/:id",
  Middleware.authMiddleware,
  Middleware.permission("lihat_mitra"),
  instansi.getById
);

router.put(
  "/instansi/hide/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_mitra"),
  instansi.hideInstansi
);

router.put(
  "/instansi/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_mitra"),
  instansi.updateByid
);

router.delete(
  "/instansi/:id",
  Middleware.authMiddleware,
  Middleware.permission("hapus_mitra"),
  instansi.deleteByid
);

export default router;
