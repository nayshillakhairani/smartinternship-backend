import express from "express";
import Middleware from "../middleware/auth-middleware.js";
import Penilaian from "../controller/penilaian_template.js";
import storage from "../utils/storage.js";

const router = express.Router();

router.get(
  "/template/penilaian",
  Middleware.authMiddleware,
  Middleware.permission("lihat_template"),
  Penilaian.get
);

router.put(
  "/template/penilaian",
  Middleware.authMiddleware,
  Middleware.permission("ubah_template"),
  storage.template.single("template"),
  Penilaian.update
);

export default router;