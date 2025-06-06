import express from "express";
import Middleware from "../middleware/auth-middleware.js";
import DetailProject from "../controller/detail_project.js";

const router = express.Router();

router.get(
  "/detail-projects",
  Middleware.authMiddleware,
  Middleware.permission("lihat_detail_project"),
  DetailProject.get
);
router.get(
  "/detail-project/:id",
  Middleware.authMiddleware,
  Middleware.permission("lihat_detail_project"),
  DetailProject.getDetail
);
router.put(
  "/detail-project/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_detail_project"),
  DetailProject.update
);
router.post(
  "/detail-project",
  Middleware.authMiddleware,
  Middleware.permission("tambah_detail_project"),
  DetailProject.store
);
router.delete(
  "/detail-project/:id",
  Middleware.authMiddleware,
  Middleware.permission("hapus_detail_project"),
  DetailProject.destroy
)

export default router;