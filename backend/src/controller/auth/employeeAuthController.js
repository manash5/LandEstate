import { Employee } from '../../models/index.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../security/jwt-util.js';

/**
 * Employee login
 */
const employeeLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find employee by email
        const employee = await Employee.findOne({
            where: { 
                email: email.toLowerCase(),
                isActive: true 
            }
        });

        if (!employee) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, employee.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = generateToken({ 
            id: employee.id, 
            email: employee.email,
            type: 'employee'
        });

        // Remove password from response
        const { password: _, ...employeeData } = employee.toJSON();

        res.status(200).json({
            success: true,
            data: {
                employee: employeeData,
                token
            },
            message: "Employee login successful"
        });

    } catch (error) {
        console.error('Error during employee login:', error);
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

/**
 * Get current employee info
 */
const getCurrentEmployee = async (req, res) => {
    try {
        if (req.user?.type !== 'employee') {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const employee = await Employee.findByPk(req.user.id, {
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
            message: "Employee data fetched successfully"
        });

    } catch (error) {
        console.error('Error fetching current employee:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch employee data"
        });
    }
};

export {
    employeeLogin,
    getCurrentEmployee
};
