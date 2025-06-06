import express from "express";
import admin from "../controller/admin.js";
import Middleware from "../middleware/auth-middleware.js";
import storage from "../utils/storage.js";

const router = express.Router();

router.get(
  "/admin/dashboard",
  Middleware.authMiddleware,
  Middleware.permission("lihat_dashboard"),
  admin.getAllDashboard
);

router.get(
  "/admin/user",
  Middleware.authMiddleware,
  Middleware.permission("lihat_users"),
  admin.getAllUser
);

router.get(
  "/admin/monitoring",
  Middleware.authMiddleware,
  Middleware.permission("lihat_monitoring"),
  admin.getMonitoring
);

router.put(
  "/admin/monitoring/project/:id",
  Middleware.authMiddleware,
  Middleware.permission("lihat_monitoring"),
  admin.approveProject
);

router.put(
  "/admin/pengajuan/administrasi/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_pengajuan_administrasi"),
  admin.aproveUserAdministrasi
);

router.put(
  "/admin/pengajuan/tes_kemampuan/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_pengajuan_tes_kemampuan"),
  admin.aproveUserKemampuan
);

router.put(
  "/admin/pengajuan/wawancara/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_pengajuan_wawancara"),
  admin.aproveUserWawancara
);

router.post(
  "/admin/sertifikat",
  Middleware.authMiddleware,
  Middleware.permission("tambah_sertifikat"),
  storage.certificate.single("file"),
  admin.insertCertificate
);

router.post(
  "/admin/user/sertifikat",
  Middleware.authMiddleware,
  Middleware.permission("tambah_sertifikat"),
  admin.giveCertificate
);

router.post(
  "/admin/posisi/sertifikat",
  Middleware.authMiddleware,
  Middleware.permission("tambah_sertifikat"),
  storage.certificate.single("file"),
  admin.insertCertificatePosisi
);

router.get(
  "/admin/alumni",
  Middleware.authMiddleware,
  Middleware.permission("lihat_alumni"),
  admin.getAllAlumni
);

router.get(
  "/super_admin/admin",
  Middleware.authMiddleware,
  Middleware.permission("lihat_admin"),
  admin.getAllAdmin
);

router.post(
  "/super_admin/admin",
  Middleware.authMiddleware,
  Middleware.permission("tambah_admin"),
  admin.createAdmin
);

router.put(
  "/super_admin/admin/:id",
  Middleware.authMiddleware,
  Middleware.permission("ubah_admin"),
  admin.updateAdmin
);

router.delete(
  "/super_admin/admin/:id",
  Middleware.authMiddleware,
  Middleware.permission("hapus_admin"),
  admin.deleteAdmin
);

export default router;
