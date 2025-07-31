import express from 'express';
import { 
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployeeById
} from '../../controller/employee/EmployeeController.js';
import { authenticateToken } from '../../middleware/token-middleware.js';

const router = express.Router();

// All employee management routes require authentication (admin only)
router.use(authenticateToken);

// Create new employee
router.post('/', createEmployee);

// Get all employees for the logged-in manager
router.get('/', getEmployees);

// Get employee by ID
router.get('/:id', getEmployeeById);

// Update employee
router.put('/:id', updateEmployee);

// Delete employee
router.delete('/:id', deleteEmployee);

export default router;
