import { Employee, User, Property, MaintenanceRecord, Room } from '../../models/index.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { 
    isValidEmail, 
    validatePasswordStrength, 
    isValidPhone, 
    validateName, 
    sanitizeInput 
} from '../../utils/validation.js';

/**
 * Create new employee
 */
const createEmployee = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Name, email, and password are required" 
            });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid email format" 
            });
        }

        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ 
                success: false,
                message: `Password validation failed: ${passwordValidation.errors.join(', ')}` 
            });
        }

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ where: { email } });
        if (existingEmployee) {
            return res.status(400).json({ 
                success: false,
                message: "Employee with this email already exists" 
            });
        }

        // Create employee
        const employee = await Employee.create({
            name: sanitizeInput(name),
            email: email.toLowerCase(),
            password,
            phone: phone || null
        });

        // Remove password from response
        const { password: _, ...employeeData } = employee.toJSON();

        res.status(201).json({
            success: true,
            data: employeeData,
            message: "Employee created successfully"
        });

    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to create employee" 
        });
    }
};

/**
 * Get all employees for a manager
 */
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            attributes: { exclude: ['password'] },
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: employees,
            message: "Employees fetched successfully"
        });

    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch employees" 
        });
    }
};

/**
 * Update employee
 */
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, isActive } = req.body;

        // Find employee
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ 
                success: false,
                message: "Employee not found" 
            });
        }

        // Validate email if provided
        if (email && !isValidEmail(email)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid email format" 
            });
        }

        // Check if email already exists (exclude current employee)
        if (email && email !== employee.email) {
            const existingEmployee = await Employee.findOne({ 
                where: { 
                    email: email.toLowerCase(),
                    id: { [Op.ne]: id }
                }
            });
            
            if (existingEmployee) {
                return res.status(400).json({ 
                    success: false,
                    message: "Employee with this email already exists" 
                });
            }
        }

        // Update employee
        const updateData = {};
        if (name) updateData.name = sanitizeInput(name);
        if (email) updateData.email = email.toLowerCase();
        if (phone !== undefined) updateData.phone = phone;
        if (isActive !== undefined) updateData.isActive = isActive;

        await employee.update(updateData);

        // Get updated employee without password
        const updatedEmployee = await Employee.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            success: true,
            data: updatedEmployee,
            message: "Employee updated successfully"
        });

    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update employee" 
        });
    }
};

/**
 * Delete employee
 */
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Find employee
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ 
                success: false,
                message: "Employee not found" 
            });
        }

        await employee.destroy();

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to delete employee" 
        });
    }
};

/**
 * Get employee by ID
 */
const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!employee) {
            return res.status(404).json({ 
                success: false,
                message: "Employee not found" 
            });
        }

        res.status(200).json({
            success: true,
            data: employee,
            message: "Employee fetched successfully"
        });

    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch employee" 
        });
    }
};

/**
 * Get employee dashboard data
 */
const getEmployeeDashboard = async (req, res) => {
    try {
        const employeeId = req.employee.id;

        // Get employee details
        const employee = await Employee.findByPk(employeeId, {
            attributes: { exclude: ['password'] }
        });

        if (!employee) {
            return res.status(404).json({ 
                success: false,
                message: "Employee not found" 
            });
        }

        // Get properties assigned to this employee with their rooms
        let assignedProperties;
        try {
            assignedProperties = await Property.findAll({
                where: { employeeId: employeeId },
                attributes: ['id', 'name', 'location', 'price', 'priceDuration', 'type', 'beds', 'baths', 'areaSqm', 'mainImage'],
                include: [{
                    model: Room,
                    as: 'rooms',
                    required: false, // LEFT JOIN to include properties even if they have no rooms
                    attributes: ['id', 'number', 'status', 'tenant', 'tenantContact', 'rent']
                }]
            });
        } catch (includeError) {
            console.log('Error including rooms, falling back to properties only:', includeError);
            // Fallback: fetch properties without rooms if association fails
            assignedProperties = await Property.findAll({
                where: { employeeId: employeeId },
                attributes: ['id', 'name', 'location', 'price', 'priceDuration', 'type', 'beds', 'baths', 'areaSqm', 'mainImage']
            });
        }

        // Get maintenance records for assigned properties
        const propertyIds = assignedProperties.map(prop => prop.id);
        const maintenanceRecords = propertyIds.length > 0 ? await MaintenanceRecord.findAll({
            where: { 
                propertyId: { [Op.in]: propertyIds }
            },
            order: [['serviceDate', 'DESC']],
            limit: 10
        }) : [];

        // Calculate dashboard statistics with actual room counts
        const totalProperties = assignedProperties.length;
        const totalRooms = assignedProperties.reduce((sum, property) => {
            return sum + (property.rooms ? property.rooms.length : 0);
        }, 0);
        const occupiedRooms = assignedProperties.reduce((sum, property) => {
            if (property.rooms) {
                return sum + property.rooms.filter(room => room.status !== 'vacant').length;
            }
            return sum;
        }, 0);
        const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
        
        // Count open issues (maintenance records with status not completed)
        const openIssues = maintenanceRecords.filter(record => record.status !== 'completed').length;
        
        // Calculate monthly revenue from assigned properties
        const monthlyRevenue = assignedProperties.reduce((sum, prop) => {
            if (prop.priceDuration === 'per month') {
                return sum + parseFloat(prop.price || 0);
            }
            return sum;
        }, 0);

        // Get recent maintenance activities
        const recentActivities = maintenanceRecords.slice(0, 5).map(record => ({
            id: record.id,
            type: 'maintenance',
            message: `${record.serviceName}: ${record.description || 'Maintenance service'}`,
            timestamp: record.serviceDate,
            priority: record.status === 'pending' ? 'high' : 'normal'
        }));

        const dashboardData = {
            employee: {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                role: employee.role || 'Property Manager',
                department: employee.department || 'Operations'
            },
            stats: {
                totalProperties,
                totalRooms,
                occupiedRooms,
                occupancyRate,
                openIssues,
                monthlyRevenue
            },
            properties: assignedProperties,
            recentActivities,
            maintenanceRecords: maintenanceRecords.slice(0, 10)
        };

        res.status(200).json({
            success: true,
            data: dashboardData,
            message: "Dashboard data fetched successfully"
        });

    } catch (error) {
        console.error('Error fetching employee dashboard:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch dashboard data" 
        });
    }
};

/**
 * Get assigned properties for employee
 */
const getAssignedProperties = async (req, res) => {
    try {
        const employeeId = req.employee.id;

        const properties = await Property.findAll({
            where: { employeeId: employeeId },
            include: [
                {
                    model: Room,
                    as: 'rooms',
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: properties,
            message: "Assigned properties fetched successfully"
        });

    } catch (error) {
        console.error('Error fetching assigned properties:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch assigned properties" 
        });
    }
};

/**
 * Get maintenance records for employee's properties
 */
const getMaintenanceRecords = async (req, res) => {
    try {
        const employeeId = req.employee.id;

        // Get property IDs assigned to this employee
        const assignedProperties = await Property.findAll({
            where: { employeeId: employeeId },
            attributes: ['id']
        });

        const propertyIds = assignedProperties.map(prop => prop.id);

        const maintenanceRecords = propertyIds.length > 0 ? await MaintenanceRecord.findAll({
            where: { 
                propertyId: { [Op.in]: propertyIds }
            },
            include: [{
                model: Property,
                attributes: ['name']
            }],
            order: [['serviceDate', 'DESC']]
        }) : [];

        res.status(200).json({
            success: true,
            data: maintenanceRecords,
            message: "Maintenance records fetched successfully"
        });

    } catch (error) {
        console.error('Error fetching maintenance records:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch maintenance records" 
        });
    }
};

export {
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeeDashboard,
    getAssignedProperties,
    getMaintenanceRecords
};
