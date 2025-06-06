import express from "express";
import User from "../controller/user.js";
import storage from "../utils/storage.js";
import Middleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.put(
  "/user",
  Middleware.authMiddleware,
  User.updateUser
);
router.put(
  "/user/admin",
  Middleware.authMiddleware,
  User.updateAdmin
);
router.put(
  "/upload-surat",
  Middleware.authMiddleware,
  storage.surat.single("surat"),
  User.uploadSurat
)
router.put(
  "/upload-cv",
  Middleware.authMiddleware,
  storage.cv.single("cv"),
  User.uploadCv
)
router.put(
  "/upload-profile",
  Middleware.authMiddleware,
  storage.image.single("image"),
  User.uploadImage
)
router.post(
  "/user/changepassword",
  Middleware.authMiddleware,
  User.changePassword
);

router.get("/user", Middleware.authMiddleware, User.getAllUser);
router.get("/user/:id", Middleware.authMiddleware, User.getById);
router.delete("/user", Middleware.authMiddleware, User.deleteByid);

export default router;
