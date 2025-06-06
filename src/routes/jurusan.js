import express from "express";
import jurusan from "../controller/jurusan.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/jurusan_instansi", jurusan.getAllJurusanInstansi);

router.post(
  "/jurusan",
  Middleware.authMiddleware,
  Middleware.permission("tambah_jurusan"),
  jurusan.createjurusan
);

router.get(
  "/jurusan",
  Middleware.authMiddleware,
  Middleware.permission("lihat_jurusan"),
  jurusan.getAlljurusan
);

router.get(
  "/jurusan/:id",
  Middleware.authMiddleware,
  Middleware.permission("lihat_jurusan"),
  jurusan.getById
);

router.put(
  "/jurusan/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_jurusan"),
  jurusan.updateByid
);

router.delete(
  "/jurusan/:id",
  Middleware.authMiddleware,
  Middleware.permission("hapus_jurusan"),
  jurusan.deleteByid
);

export default router;
