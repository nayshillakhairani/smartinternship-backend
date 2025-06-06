import express from "express";
import Notifikasi from "../controller/notification.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get(
    "/notifications/user",
    Middleware.authMiddleware,
    Middleware.permission("lihat_notifikasi"),
    Notifikasi.notification
);

router.get(
    "/notifications/admin",
    Middleware.authMiddleware,
    Middleware.permission("lihat_notifikasi"),
    Notifikasi.notification
);

router.put(
    "/notifications/read",
    Middleware.authMiddleware,
    Middleware.permission("lihat_notifikasi"),
    Notifikasi.readNotification
);

router.get(
    "/notifications/check",
    Middleware.authMiddleware,
    Middleware.permission("lihat_notifikasi"),
    Notifikasi.checkNotification
);

export default router;
