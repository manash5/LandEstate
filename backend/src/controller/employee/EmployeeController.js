import { Employee, User } from '../../models/index.js';
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

export {
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployeeById
};
