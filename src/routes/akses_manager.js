import express from "express";
import access_manager from "../controller/akses_manager.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/permissions",Middleware.authMiddleware, Middleware.permission("lihat_akses_manager"), access_manager.getPermissions);
router.get("/roles",Middleware.authMiddleware, Middleware.permission("lihat_akses_manager"), access_manager.getRoles);
router.post("/roles",Middleware.authMiddleware, Middleware.permission("tambah_akses_manager"), access_manager.createRole);
router.get("/access_managers",Middleware.authMiddleware, Middleware.permission("lihat_akses_manager"), access_manager.get);
router.put("/access_managers",Middleware.authMiddleware ,Middleware.permission("ubah_akses_manager"), access_manager.update);

export default router;