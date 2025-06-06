import express from "express";
import Middleware from "../middleware/auth-middleware.js";
import Penilaian from "../controller/penilaian.js";

const router = express.Router();

router.get(
  "/penilaian",
  Middleware.authMiddleware,
  Middleware.permission("lihat_penilaian"),
  Penilaian.get
);
router.get(
  "/mentees",
  Middleware.authMiddleware,
  Middleware.permission("lihat_penilaian"),
  Penilaian.getAllMentees
)
router.get(
  "/penilaian/:id",
  Middleware.authMiddleware,
  Middleware.permission("lihat_penilaian"),
  Penilaian.getDetail
);
router.put(
  "/penilaian/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_penilaian"),
  Penilaian.update
);
router.post(
  "/penilaian",
  Middleware.authMiddleware,
  Middleware.permission("tambah_penilaian"),
  Penilaian.store
);
router.delete(
  "/penilaian/:id",
  Middleware.authMiddleware,
  Middleware.permission("hapus_penilaian"),
  Penilaian.destroy
);

export default router;