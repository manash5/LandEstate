import express from 'express';
import { 
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeeDashboard,
    getAssignedProperties,
    getMaintenanceRecords,
    createMaintenanceRecord,
    updateMaintenanceRecord,
    seedDatabaseData,
    createInitialConversationsEndpoint,
    getDatabaseDiagnosticsEndpoint,
    runDatabaseMigrations,
    resetDatabaseEndpoint,
    checkDatabaseHealthEndpoint
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

// Database utility routes (admin only)
router.post('/manage/seed-database', seedDatabaseData);
router.post('/manage/create-conversations', createInitialConversationsEndpoint);
router.get('/manage/diagnostics', getDatabaseDiagnosticsEndpoint);
router.post('/manage/run-migrations', runDatabaseMigrations);
router.post('/manage/reset-database', resetDatabaseEndpoint);
router.get('/manage/health-check', checkDatabaseHealthEndpoint);

// Employee dashboard routes (require employee auth)
router.use('/dashboard', authenticateEmployee);
router.get('/dashboard', getEmployeeDashboard);
router.get('/dashboard/properties', getAssignedProperties);
router.get('/dashboard/maintenance', getMaintenanceRecords);
router.post('/dashboard/maintenance', createMaintenanceRecord);
router.put('/dashboard/maintenance/:id', updateMaintenanceRecord);

export default router;
