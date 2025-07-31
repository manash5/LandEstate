import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Employee } from "../models/index.js";

dotenv.config();

/**
 * Middleware to authenticate employee tokens
 */
export const authenticateEmployee = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access denied. No token provided.' 
            });
        }

        const decoded = jwt.verify(token, process.env.secretkey || 'your-secret-key');
        
        // Check if this is an employee token
        if (decoded.type !== 'employee') {
            return res.status(403).json({ 
                success: false,
                message: 'Access denied. Employee token required.' 
            });
        }

        // Verify employee exists and is active
        const employee = await Employee.findOne({
            where: { 
                id: decoded.id,
                isActive: true 
            },
            attributes: { exclude: ['password'] }
        });

        if (!employee) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token. Employee not found or inactive.' 
            });
        }

        req.user = decoded;
        req.employee = employee;
        next();
    } catch (error) {
        console.error('Employee authentication error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token.' 
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expired.' 
            });
        }
        
        return res.status(500).json({ 
            success: false,
            message: 'Token verification failed.' 
        });
    }
};

/**
 * Middleware to verify that the authenticated employee can only access/modify their own data
 * This should be used after authenticateEmployee middleware
 */
export const authorizeEmployee = (req, res, next) => {
    try {
        const { id } = req.params;
        
        // If no specific ID in params, allow access (for general employee data)
        if (!id) {
            return next();
        }
        
        // Check if employee is trying to access their own data
        if (parseInt(id) !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: 'Access denied. You can only access your own data.' 
            });
        }
        
        next();
    } catch (error) {
        console.error('Employee authorization error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Authorization failed.' 
        });
    }
};
