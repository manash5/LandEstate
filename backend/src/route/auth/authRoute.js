import express from "express";
import { authController } from "../../controller/index.js";
import { authenticateToken } from "../../middleware/token-middleware.js";

const router = express.Router();

// Protected route that requires authentication
router.get("/init", authenticateToken, authController.init);

// Public routes that don't require authentication
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/verify-reset-token/:token", authController.verifyResetToken);

export { router as authRouter };