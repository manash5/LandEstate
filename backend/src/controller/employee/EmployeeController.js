import { Employee, User, Property, MaintenanceRecord, Room, Conversation, Message } from '../../models/index.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { 
    isValidEmail, 
    validatePasswordStrength, 
    isValidPhone, 
    validateName, 
    sanitizeInput 
} from '../../utils/validation.js';
import { 
    seedDatabase, 
    createInitialConversations, 
    getDatabaseDiagnostics 
} from '../../utils/databaseSeeder.js';
import { 
    runMigrations, 
    resetDatabase, 
    checkDatabaseHealth 
} from '../../utils/databaseMigrations.js';

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
            phone: phone || null,
            managerId: req.user.id  // Set the current user as the manager
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
        // Get the current user's ID from the token middleware
        const managerId = req.user.id;

        const employees = await Employee.findAll({
            where: {
                managerId: managerId
            },
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
        const managerId = req.user.id;

        // Find employee belonging to current manager
        const employee = await Employee.findOne({
            where: {
                id: id,
                managerId: managerId
            }
        });

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
        const managerId = req.user.id;

        // Find employee belonging to current manager
        const employee = await Employee.findOne({
            where: {
                id: id,
                managerId: managerId
            }
        });

        if (!employee) {
            return res.status(404).json({ 
                success: false,
                message: "Employee not found" 
            });
        }

        // Clean up employee-related data
        const virtualUserId = -parseInt(id);
        
        // Delete messages involving this employee
        await Message.destroy({
            where: {
                [Op.or]: [
                    { senderId: virtualUserId },
                    { receiverId: virtualUserId }
                ]
            }
        });

        // Delete conversations involving this employee
        await Conversation.destroy({
            where: {
                [Op.or]: [
                    { user1Id: virtualUserId },
                    { user2Id: virtualUserId }
                ]
            }
        });

        // Delete the virtual user entry
        await User.destroy({
            where: { id: virtualUserId }
        });

        // Finally delete the employee
        await employee.destroy();

        console.log(`✓ Cleaned up employee ${id} and related messaging data`);

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
        const managerId = req.user.id;

        const employee = await Employee.findOne({
            where: {
                id: id,
                managerId: managerId
            },
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
        
        // Calculate monthly revenue from room rents
        const monthlyRevenue = assignedProperties.reduce((sum, prop) => {
            if (prop.rooms && prop.rooms.length > 0) {
                // Sum up rent from all rooms in this property
                const propertyRent = prop.rooms.reduce((roomSum, room) => {
                    return roomSum + parseFloat(room.rent || 0);
                }, 0);
                return sum + propertyRent;
            }
            // Fallback to property price if no rooms defined
            else if (prop.priceDuration === 'per month') {
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
            include: [
                {
                    model: Property,
                    as: 'property',
                    attributes: ['name', 'location']
                },
                {
                    model: Room,
                    as: 'room',
                    attributes: ['number', 'id'],
                    required: false
                }
            ],
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

const createMaintenanceRecord = async (req, res) => {
    try {
        const employeeId = req.employee.id;
        const { 
            serviceName,
            location,
            description,
            status = 'pending',
            cost = 0,
            technician,
            serviceDate,
            propertyId,
            roomId
        } = req.body;

        // Validate required fields
        if (!serviceName || !location || !propertyId) {
            return res.status(400).json({
                success: false,
                message: "Service name, location, and property ID are required"
            });
        }

        // Check if the property is assigned to this employee
        const assignedProperty = await Property.findOne({
            where: { 
                id: propertyId,
                employeeId: employeeId 
            }
        });

        if (!assignedProperty) {
            return res.status(403).json({
                success: false,
                message: "You can only create maintenance records for your assigned properties"
            });
        }

        // If roomId is provided, validate it belongs to the property
        if (roomId) {
            const room = await Room.findOne({
                where: {
                    id: roomId,
                    propertyId: propertyId
                }
            });

            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid room ID for the specified property"
                });
            }
        }

        // Create the maintenance record
        const maintenanceRecord = await MaintenanceRecord.create({
            serviceName: sanitizeInput(serviceName),
            location: sanitizeInput(location),
            description: description ? sanitizeInput(description) : null,
            status,
            cost: parseFloat(cost) || 0,
            technician: technician ? sanitizeInput(technician) : null,
            serviceDate: serviceDate ? new Date(serviceDate) : new Date(),
            propertyId,
            roomId: roomId || null
        });

        // Fetch the created record with property details
        const createdRecord = await MaintenanceRecord.findByPk(maintenanceRecord.id, {
            include: [
                {
                    model: Property,
                    as: 'property',
                    attributes: ['name', 'location']
                },
                {
                    model: Room,
                    as: 'room',
                    attributes: ['number', 'id'],
                    required: false
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: createdRecord,
            message: "Maintenance record created successfully"
        });

    } catch (error) {
        console.error('Error creating maintenance record:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create maintenance record"
        });
    }
};

/**
 * Seed database with initial data (Admin only)
 */
const seedDatabaseData = async (req, res) => {
    try {
        const result = await seedDatabase();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error seeding database:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to seed database', 
            error: error.message 
        });
    }
};

/**
 * Create initial conversations between employees and managers (Admin only)
 */
const createInitialConversationsEndpoint = async (req, res) => {
    try {
        const result = await createInitialConversations();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error creating initial conversations:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create initial conversations', 
            error: error.message 
        });
    }
};

/**
 * Get database diagnostics (Admin only)
 */
const getDatabaseDiagnosticsEndpoint = async (req, res) => {
    try {
        const diagnostics = await getDatabaseDiagnostics();
        res.status(200).json({ 
            success: true, 
            message: 'Database diagnostics retrieved successfully',
            data: diagnostics 
        });
    } catch (error) {
        console.error('Error getting database diagnostics:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get database diagnostics', 
            error: error.message 
        });
    }
};

/**
 * Run database migrations (Admin only)
 */
const runDatabaseMigrations = async (req, res) => {
    try {
        const result = await runMigrations();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error running migrations:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to run migrations', 
            error: error.message 
        });
    }
};

/**
 * Reset database (Admin only - DANGEROUS)
 */
const resetDatabaseEndpoint = async (req, res) => {
    try {
        if (req.body.confirmReset !== 'YES_DELETE_ALL_DATA') {
            return res.status(400).json({ 
                success: false, 
                message: 'Database reset requires confirmation. Send { "confirmReset": "YES_DELETE_ALL_DATA" }' 
            });
        }
        
        const result = await resetDatabase();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error resetting database:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to reset database', 
            error: error.message 
        });
    }
};

/**
 * Check database health
 */
const checkDatabaseHealthEndpoint = async (req, res) => {
    try {
        const health = await checkDatabaseHealth();
        res.status(health.success ? 200 : 500).json(health);
    } catch (error) {
        console.error('Error checking database health:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to check database health', 
            error: error.message 
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
    getMaintenanceRecords,
    createMaintenanceRecord,
    seedDatabaseData,
    createInitialConversationsEndpoint,
    getDatabaseDiagnosticsEndpoint,
    runDatabaseMigrations,
    resetDatabaseEndpoint,
    checkDatabaseHealthEndpoint
};
