import express from "express";
import project from "../controller/project.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/project", Middleware.authMiddleware,  Middleware.permission("tambah_project"),project.createProject);
router.get("/projects", Middleware.authMiddleware,  Middleware.permission("lihat_project"),project.getAllProject);
router.get("/project/:id", Middleware.authMiddleware,  Middleware.permission("lihat_project"),project.getById);
router.put("/project/:id", Middleware.authMiddleware,  Middleware.permission("ubah_project"),project.updateByid);
router.delete("/project/:id", Middleware.authMiddleware,  Middleware.permission("hapus_project"),project.deleteByid);

export default router;
