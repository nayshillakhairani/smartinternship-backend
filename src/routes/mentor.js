import express from 'express';
import mentor from '../controller/mentor.js';
import Middleware from '../middleware/auth-middleware.js';

const router = express.Router();

router.post('/mentor', Middleware.authMiddleware, Middleware.permission('tambah_mentor'), mentor.create);
router.get('/mentor', Middleware.authMiddleware, Middleware.permission('lihat_mentor'), mentor.getAll);
router.put('/mentor/:id', Middleware.authMiddleware, Middleware.permission('ubah_mentor'), mentor.updateMentor);
router.delete('/mentor/:id', Middleware.authMiddleware, Middleware.permission('hapus_mentor'), mentor.deleteMentor);
router.get('/mentee/:mentor_id', Middleware.authMiddleware, Middleware.permission('lihat_mentee'), mentor.getAllMentee);
router.get('/mentor/user', Middleware.authMiddleware, Middleware.permission('lihat_mentor'), mentor.getAllUser);
router.put('/mentee/:mentee_id', Middleware.authMiddleware, Middleware.permission('lihat_mentor'), mentor.updateMentee);
router.put('/mentee/delete/:id', Middleware.authMiddleware, Middleware.permission('lihat_mentor'), mentor.deleteMentee);
router.get('/mentor/dashboard', Middleware.authMiddleware, Middleware.permission('lihat_dashboard'), mentor.getAllDashboard);

export default router;
