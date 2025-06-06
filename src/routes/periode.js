import express from "express";
import periode from "../controller/periode.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/periode", Middleware.authMiddleware, Middleware.permission("tambah_periode"), periode.createPeriode);
router.get("/periode", Middleware.authMiddleware, Middleware.permission("lihat_periode"), periode.getAllPeriode);
router.get("/periode/:id", Middleware.authMiddleware, Middleware.permission("lihat_periode"), periode.getById);
router.put("/periode/:id", Middleware.authMiddleware, Middleware.permission("ubah_periode"), periode.updateByid);
router.delete("/periode/:id", Middleware.authMiddleware, Middleware.permission("hapus_periode"), periode.deleteByid);

export default router;
