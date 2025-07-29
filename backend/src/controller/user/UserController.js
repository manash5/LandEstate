import { User } from '../../models/index.js'
import { sendWelcomeEmail } from '../../utils/sendMail.js';
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
 *  fetch all users
 */
const getAll = async (req, res) => {
    try {
        //fetching all the data from users table
        const users = await User.findAll();
        res.status(200).send({ data: users, message: "successfully fetched data" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

/** 
 *  create new user
*/

const create = async (req, res) => {

    try {
        const body = req.body
        console.log(req.body)
        //validation
        if (!body?.email || !body?.name || !body?.password)
            return res.status(500).send({ message: "Invalid paylod" });
        const users = await User.create({
            name: body.name,
            email: body.email,
            password: body.password,
            phone: body.phone || null,
            address: body.address || null
        });
        // Send welcome email (non-blocking)
        sendWelcomeEmail(body.email, body.name).catch((err) => {
            console.error('Failed to send welcome email:', err);
        });
        res.status(201).send({ data: users, message: "successfully created user" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

/**
 *  update existing user
 */

const update = async (req, res) => {

    try {
        const { id = null } = req.params;
        const body = req.body;
        console.log(req.params)
        //checking if user exist or not
        const oldUser = await User.findOne({ where: { id } })
        if (!oldUser) {
            return res.status(500).send({ message: "User not found" });
        }
        oldUser.name = body.name;
        oldUser.password = body.password || oldUser.password;
        oldUser.email = body.email;
        oldUser.phone = body.phone || oldUser.phone;
        oldUser.address = body.address || oldUser.address;
        oldUser.profileImage = body.profileImage || oldUser.profileImage;
        oldUser.save();
        res.status(201).send({ data: oldUser, message: "user updated successfully" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Failed to update users' });
    }
}

/**
 *  delete user 
 */
const delelteById = async (req, res) => {

    try {
        const { id = null } = req.params;
        const oldUser = await User.findOne({ where: { id } })

        //checking if user exist or not
        if (!oldUser) {
            return res.status(500).send({ message: "User not found" });
        }
        oldUser.destroy();
        res.status(201).send({ message: "user deleted successfully" })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

/**
 *  fetch user by id
 */
const getById = async (req, res) => {

    try {
        const { id = null } = req.params;
        const user = await User.findOne({ where: { id } })
        if (!user) {
            return res.status(500).send({ message: "User not found" });
        }
        res.status(201).send({ message: "user fetched successfully", data: user })
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

/**
 *  update user profile image
 */
const updateProfileImage = async (req, res) => {
    try {
        const { id = null } = req.params;
        
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded" });
        }

        // Check if user exists
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Update profile image path
        const imagePath = `/uploads/${req.file.filename}`;
        user.profileImage = imagePath;
        await user.save();

        res.status(200).send({ 
            data: user, 
            message: "Profile image updated successfully",
            imagePath: imagePath
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Failed to update profile image' });
    }
}

/**
 * Update user account information (name, email, phone, address)
 */
const updateAccountInfo = async (req, res) => {
    try {
        const { id } = req.params;
        let { name, email, phone, address } = req.body;

        // Sanitize inputs
        name = sanitizeInput(name);
        email = sanitizeInput(email);
        phone = sanitizeInput(phone);
        address = sanitizeInput(address);

        // Validate required fields
        if (!name || !email) {
            return res.status(400).send({ 
                message: "Name and email are required fields" 
            });
        }

        // Validate name
        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            return res.status(400).send({ message: nameValidation.message });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).send({ 
                message: "Please provide a valid email address" 
            });
        }

        // Validate phone if provided
        if (phone && !isValidPhone(phone)) {
            return res.status(400).send({ 
                message: "Please provide a valid phone number" 
            });
        }

        // Check if user exists
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Check if email is already taken by another user
        if (email !== user.email) {
            const existingUser = await User.findOne({ 
                where: { 
                    email,
                    id: { [Op.ne]: id }
                } 
            });
            if (existingUser) {
                return res.status(400).send({ 
                    message: "Email is already registered to another account" 
                });
            }
        }

        // Update user information
        await user.update({
            name,
            email,
            phone: phone || user.phone,
            address: address || user.address
        });

        // Return updated user without password
        const updatedUser = await User.findOne({ 
            where: { id },
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
        });

        res.status(200).send({ 
            data: updatedUser, 
            message: "Account information updated successfully" 
        });

    } catch (e) {
        console.error('Error updating account info:', e);
        res.status(500).json({ error: 'Failed to update account information' });
    }
};

/**
 * Change user password with current password verification
 */
const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).send({ 
                message: "Current password, new password, and confirm password are required" 
            });
        }

        // Validate new password matches confirmation
        if (newPassword !== confirmPassword) {
            return res.status(400).send({ 
                message: "New password and confirm password do not match" 
            });
        }

        // Validate new password strength
        const passwordValidation = validatePasswordStrength(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).send({ 
                message: passwordValidation.message 
            });
        }

        // Check if user exists
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).send({ 
                message: "Current password is incorrect" 
            });
        }

        // Check if new password is different from current
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).send({ 
                message: "New password must be different from current password" 
            });
        }

        // Update password (bcrypt hashing will be handled by the beforeUpdate hook)
        await user.update({ password: newPassword });

        res.status(200).send({ 
            message: "Password changed successfully" 
        });

    } catch (e) {
        console.error('Error changing password:', e);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

/**
 * Get user profile information (excluding sensitive data)
 */
const getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ 
            where: { id },
            attributes: { 
                exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] 
            }
        });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ 
            data: user, 
            message: "Profile fetched successfully" 
        });

    } catch (e) {
        console.error('Error fetching profile:', e);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

/**
 * Validate current password (for security verification)
 */
const validateCurrentPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).send({ 
                message: "Password is required" 
            });
        }

        // Check if user exists
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        res.status(200).send({ 
            isValid: isPasswordValid,
            message: isPasswordValid ? "Password is valid" : "Password is invalid"
        });

    } catch (e) {
        console.error('Error validating password:', e);
        res.status(500).json({ error: 'Failed to validate password' });
    }
};


export const UserController = {
    getAll,
    create,
    getById,
    delelteById,
    update,
    updateProfileImage,
    updateAccountInfo,
    changePassword,
    getProfile,
    validateCurrentPassword
}