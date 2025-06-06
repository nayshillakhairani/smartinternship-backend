import express from "express";
import testimoni from "../controller/testimoni.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/testimoni", Middleware.authMiddleware,  Middleware.permission("tambah_testimoni"),testimoni.createTestimoni);
router.get("/testimoni", Middleware.authMiddleware,  Middleware.permission("lihat_testimoni"),testimoni.getAllTestimoni);
router.get("/testimoni/user", Middleware.authMiddleware,  Middleware.permission("lihat_testimoni"),testimoni.getDetail);
router.get("/testimoni/alumni", testimoni.getAlumni);
router.put("/testimoni/:id", Middleware.authMiddleware,  Middleware.permission("ubah_testimoni"),testimoni.updateTestimoni);
router.get("/testimoni/check", Middleware.authMiddleware,  Middleware.permission("lihat_testimoni"), testimoni.check);

export default router;
