import express from 'express';
import { 
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeeDashboard,
    getAssignedProperties,
    getMaintenanceRecords
} from '../../controller/employee/EmployeeController.js';
import { authenticateToken } from '../../middleware/token-middleware.js';
import { authenticateEmployee } from '../../middleware/employee-auth-middleware.js';

const router = express.Router();

// Admin routes for employee management (require admin auth)
router.use('/manage', authenticateToken);
router.post('/manage', createEmployee);
router.get('/manage', getEmployees);
router.get('/manage/:id', getEmployeeById);
router.put('/manage/:id', updateEmployee);
router.delete('/manage/:id', deleteEmployee);

// Employee dashboard routes (require employee auth)
router.use('/dashboard', authenticateEmployee);
router.get('/dashboard', getEmployeeDashboard);
router.get('/dashboard/properties', getAssignedProperties);
router.get('/dashboard/maintenance', getMaintenanceRecords);

export default router;
