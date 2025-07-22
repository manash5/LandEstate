import express from "express";
import { authController } from "../../controller/index.js";
const router = express.Router();
router.get("/init", authController.init);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/verify-reset-token/:token", authController.verifyResetToken);

export { router as authRouter };