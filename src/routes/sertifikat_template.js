import express from "express";
import Middleware from "../middleware/auth-middleware.js";
import Sertifikat from "../controller/sertifikat_template.js";
import storage from "../utils/storage.js";

const router = express.Router();

router.get(
  "/template/sertifikat",
  Middleware.authMiddleware,
  Middleware.permission("lihat_template"),
  Sertifikat.get
);

router.put(
  "/template/sertifikat",
  Middleware.authMiddleware,
  Middleware.permission("ubah_template"),
  storage.template.single("template"),
  Sertifikat.update
);

export default router;