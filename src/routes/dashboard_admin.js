import express from 'express';
import dashboardAdmin from '../controller/dashboard_admin.js';
import Middleware from '../middleware/auth-middleware.js';

const router = express.Router();

router.get('/filtered/user-active', Middleware.authMiddleware, Middleware.permission('lihat_dashboard'), dashboardAdmin.getFilteredUserActive);
router.get('/filtered/user-register', Middleware.authMiddleware, Middleware.permission('lihat_dashboard'), dashboardAdmin.getFilteredUserRegister);
router.get('/filtered/alumni', Middleware.authMiddleware, Middleware.permission('lihat_dashboard'), dashboardAdmin.getFilteredAlumni);
router.get('/dashboard/user-active', Middleware.authMiddleware, Middleware.permission('lihat_dashboard'), dashboardAdmin.getAllUserActive);
router.get('/dashboard/user-register', Middleware.authMiddleware, Middleware.permission('lihat_dashboard'), dashboardAdmin.getAllUserRegister);
router.get('/dashboard/grafik/user-register', Middleware.authMiddleware, Middleware.permission('lihat_dashboard'), dashboardAdmin.getGrafikUserRegister);

router.get('/export-alumni', Middleware.authMiddleware, Middleware.permission('lihat_dashboard'), dashboardAdmin.exportDataAlumni);
router.get('/export-aktif', Middleware.authMiddleware, Middleware.permission('lihat_dashboard'), dashboardAdmin.exportDataAktif);
router.get('/export-mentee/:mentor_id', Middleware.authMiddleware, Middleware.permission('lihat_dashboard'), dashboardAdmin.exportDataMentee);
router.get('/export-pendaftar', Middleware.authMiddleware, Middleware.permission('lihat_dashboard'), dashboardAdmin.exportDataPendaftar);

export default router;
