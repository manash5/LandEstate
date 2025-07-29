/**
 * Validation utilities for user data
 */

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password 
 * @returns {object} { isValid: boolean, message: string }
 */
export const validatePasswordStrength = (password) => {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    
    if (password.length > 50) {
        return { isValid: false, message: 'Password must be less than 50 characters long' };
    }
    
    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasLetter || !hasNumber) {
        return { 
            isValid: false, 
            message: 'Password must contain at least one letter and one number' 
        };
    }
    
    return { isValid: true, message: 'Password is valid' };
};

/**
 * Validate phone number format
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
    if (!phone) return true; // Phone is optional
    
    // Allow various phone formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
    const phoneRegex = /^[\+]?[\d\s\(\)\-]{10,15}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate name format
 * @param {string} name 
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateName = (name) => {
    if (!name || name.trim().length === 0) {
        return { isValid: false, message: 'Name is required' };
    }
    
    if (name.trim().length < 2) {
        return { isValid: false, message: 'Name must be at least 2 characters long' };
    }
    
    if (name.trim().length > 50) {
        return { isValid: false, message: 'Name must be less than 50 characters long' };
    }
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(name.trim())) {
        return { 
            isValid: false, 
            message: 'Name can only contain letters, spaces, hyphens, and apostrophes' 
        };
    }
    
    return { isValid: true, message: 'Name is valid' };
};

/**
 * Sanitize user input
 * @param {string} input 
 * @returns {string}
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input.trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};
