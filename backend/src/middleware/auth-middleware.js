import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware to verify that the authenticated user can only access/modify their own data
 * This should be used after authenticateToken middleware
 */
export function authorizeUser(req, res, next) {
    try {
        const { id } = req.params;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Check if the user is trying to access/modify their own data
        if (decoded.id.toString() !== id.toString()) {
            return res.status(403).json({ 
                message: 'Access denied. You can only access your own account.' 
            });
        }

        // Add user info to request object for use in controllers
        req.user = decoded;
        next();

    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

/**
 * Middleware to check if user is admin (for future admin functionalities)
 */
export function authorizeAdmin(req, res, next) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Check if user has admin role (you'll need to add role field to User model)
        if (decoded.role !== 'admin') {
            return res.status(403).json({ 
                message: 'Access denied. Admin privileges required.' 
            });
        }

        req.user = decoded;
        next();

    } catch (error) {
        console.error('Admin authorization error:', error);
        return res.status(401).json({ message: 'Invalid token.' });
    }
}
