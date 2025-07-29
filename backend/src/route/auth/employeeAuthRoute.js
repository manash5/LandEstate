import express from 'express';
import { employeeLogin, getCurrentEmployee } from '../../controller/auth/employeeAuthController.js';
import { authenticateToken } from '../../middleware/token-middleware.js';

const router = express.Router();

// Employee login (no auth required)
router.post('/login', employeeLogin);

// Get current employee info (auth required)
router.get('/current', authenticateToken, getCurrentEmployee);

export default router;
