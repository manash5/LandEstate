import express from 'express'
import { UserController } from '../../controller/index.js';
import upload from '../../middleware/multerConfig.js';
import { authenticateToken } from '../../middleware/token-middleware.js';
import { authorizeUser } from '../../middleware/auth-middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get("/", UserController.getAll);
router.post("/", UserController.create);

// Protected routes (authentication required)
router.patch("/:id", authenticateToken, UserController.update);
router.post("/:id/profile-image", authenticateToken, authorizeUser, upload.single("profileImage"), UserController.updateProfileImage);
router.get("/:id", authenticateToken, UserController.getById);
router.delete("/:id", authenticateToken, UserController.delelteById);

// Account & Security routes (require authentication and user authorization)
router.get("/:id/profile", authenticateToken, authorizeUser, UserController.getProfile);
router.patch("/:id/account-info", authenticateToken, authorizeUser, UserController.updateAccountInfo);
router.patch("/:id/change-password", authenticateToken, authorizeUser, UserController.changePassword);
router.post("/:id/validate-password", authenticateToken, authorizeUser, UserController.validateCurrentPassword);

// Dashboard routes (require authentication only)
router.get("/:id/dashboard", authenticateToken, UserController.getDashboard);
router.get("/:id/dashboard/revenue", authenticateToken, UserController.getRevenueDetails);
router.get("/:id/dashboard/maintenance", authenticateToken, UserController.getMaintenanceDetails);
router.get("/:id/dashboard/occupancy", authenticateToken, UserController.getOccupancyDetails);

export { router as userRouter };


