import { User, Property, Room, MaintenanceRecord } from '../../models/index.js'
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

/**
 * Get user dashboard data including revenue, maintenance, and room occupancy
 */
const getDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const { month, year } = req.query;

        console.log('Dashboard API called for user ID:', id);
        console.log('Query params - month:', month, 'year:', year);

        // Default to current month/year if not provided
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        // Check if user exists
        const user = await User.findOne({ 
            where: { id },
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
        });

        if (!user) {
            console.log('User not found for ID:', id);
            return res.status(404).send({ message: "User not found" });
        }

        console.log('User found:', user.name, user.email);

        // Get all properties owned by the user with their rooms
        const properties = await Property.findAll({
            where: { userId: id },
            include: [{
                model: Room,
                as: 'rooms',
                required: false,
                attributes: ['id', 'number', 'status', 'tenant', 'rent', 'rentDueDate']
            }]
        });

        console.log('Properties found for user:', properties.length);
        console.log('Properties data:', properties.map(p => ({
            id: p.id,
            name: p.name,
            userId: p.userId,
            roomCount: p.rooms ? p.rooms.length : 0
        })));

        if (properties.length === 0) {
            console.log('No properties found for user, returning empty dashboard');
            return res.status(200).send({
                data: {
                    user,
                    stats: {
                        totalProperties: 0,
                        totalRooms: 0,
                        occupiedRooms: 0,
                        vacantRooms: 0,
                        occupancyRate: 0,
                        monthlyRevenue: 0,
                        maintenanceCosts: 0,
                        netRevenue: 0
                    },
                    revenueData: {
                        totalRoomRent: 0,
                        maintenanceCosts: 0,
                        netRevenue: 0,
                        month: targetMonth,
                        year: targetYear
                    },
                    maintenanceData: {
                        totalCost: 0,
                        recordsCount: 0,
                        byStatus: {
                            pending: 0,
                            'in-progress': 0,
                            completed: 0,
                            cancelled: 0
                        }
                    },
                    occupancyData: {
                        totalRooms: 0,
                        occupiedRooms: 0,
                        vacantRooms: 0,
                        occupancyRate: 0
                    }
                },
                message: "Dashboard data fetched successfully"
            });
        }

        const propertyIds = properties.map(prop => prop.id);
        console.log('Property IDs for maintenance lookup:', propertyIds);

        // Get maintenance records for the specified month/year
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

        console.log('Maintenance date range:', startDate, 'to', endDate);

        const maintenanceRecords = await MaintenanceRecord.findAll({
            where: {
                propertyId: { [Op.in]: propertyIds },
                serviceDate: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        console.log('Maintenance records found:', maintenanceRecords.length);

        // Calculate room statistics
        const totalRooms = properties.reduce((sum, property) => {
            return sum + (property.rooms ? property.rooms.length : 0);
        }, 0);

        const occupiedRooms = properties.reduce((sum, property) => {
            if (property.rooms) {
                return sum + property.rooms.filter(room => 
                    room.status === 'paid' || room.status === 'unpaid'
                ).length;
            }
            return sum;
        }, 0);

        const vacantRooms = totalRooms - occupiedRooms;
        const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

        // Calculate total room rent for the month
        const totalRoomRent = properties.reduce((sum, property) => {
            if (property.rooms && property.rooms.length > 0) {
                const propertyRent = property.rooms.reduce((roomSum, room) => {
                    // Only count rent from occupied rooms
                    if (room.status === 'paid' || room.status === 'unpaid') {
                        console.log(`Room ${room.number} in ${property.name}: status=${room.status}, rent=${room.rent}`);
                        return roomSum + parseFloat(room.rent || 0);
                    }
                    return roomSum;
                }, 0);
                console.log(`Property ${property.name} total rent: ${propertyRent}`);
                return sum + propertyRent;
            }
            return sum;
        }, 0);

        console.log('Total room rent calculated:', totalRoomRent);

        // Calculate maintenance costs for the month
        const maintenanceCosts = maintenanceRecords.reduce((sum, record) => {
            console.log(`Maintenance record: ${record.serviceName}, cost: ${record.cost}`);
            return sum + parseFloat(record.cost || 0);
        }, 0);

        console.log('Total maintenance costs:', maintenanceCosts);
        console.log('Maintenance records count:', maintenanceRecords.length);

        // Calculate net revenue (room rent - maintenance costs)
        const netRevenue = totalRoomRent - maintenanceCosts;

        // Group maintenance records by status
        const maintenanceByStatus = maintenanceRecords.reduce((acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
        }, {
            pending: 0,
            'in-progress': 0,
            completed: 0,
            cancelled: 0
        });

        const dashboardData = {
            user,
            stats: {
                totalProperties: properties.length,
                totalRooms,
                occupiedRooms,
                vacantRooms,
                occupancyRate,
                monthlyRevenue: totalRoomRent,
                maintenanceCosts,
                netRevenue
            },
            revenueData: {
                totalRoomRent,
                maintenanceCosts,
                netRevenue,
                month: targetMonth,
                year: targetYear
            },
            maintenanceData: {
                totalCost: maintenanceCosts,
                recordsCount: maintenanceRecords.length,
                byStatus: maintenanceByStatus,
                records: maintenanceRecords.slice(0, 10) // Latest 10 records
            },
            occupancyData: {
                totalRooms,
                occupiedRooms,
                vacantRooms,
                occupancyRate,
                propertiesBreakdown: properties.map(property => ({
                    id: property.id,
                    name: property.name,
                    location: property.location,
                    totalRooms: property.rooms ? property.rooms.length : 0,
                    occupiedRooms: property.rooms ? property.rooms.filter(room => 
                        room.status === 'paid' || room.status === 'unpaid'
                    ).length : 0,
                    occupancyRate: property.rooms && property.rooms.length > 0 ? 
                        Math.round((property.rooms.filter(room => 
                            room.status === 'paid' || room.status === 'unpaid'
                        ).length / property.rooms.length) * 100) : 0
                }))
            }
        };

        res.status(200).send({
            data: dashboardData,
            message: "Dashboard data fetched successfully"
        });

    } catch (e) {
        console.error('Error fetching dashboard data:', e);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

/**
 * Get detailed revenue breakdown for user properties
 */
const getRevenueDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { month, year } = req.query;

        // Default to current month/year if not provided
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        // Check if user exists
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Get all properties with rooms
        const properties = await Property.findAll({
            where: { userId: id },
            include: [{
                model: Room,
                as: 'rooms',
                required: false,
                attributes: ['id', 'number', 'status', 'tenant', 'rent']
            }]
        });

        const propertyIds = properties.map(prop => prop.id);

        // Get maintenance records for the month
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

        const maintenanceRecords = await MaintenanceRecord.findAll({
            where: {
                propertyId: { [Op.in]: propertyIds },
                serviceDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [{
                model: Property,
                as: 'property',
                attributes: ['id', 'name', 'location']
            }]
        });

        // Calculate revenue by property
        const revenueByProperty = properties.map(property => {
            const propertyRent = property.rooms ? property.rooms.reduce((sum, room) => {
                if (room.status === 'paid' || room.status === 'unpaid') {
                    return sum + parseFloat(room.rent || 0);
                }
                return sum;
            }, 0) : 0;

            const propertyMaintenance = maintenanceRecords
                .filter(record => record.propertyId === property.id)
                .reduce((sum, record) => sum + parseFloat(record.cost || 0), 0);

            return {
                propertyId: property.id,
                propertyName: property.name,
                location: property.location,
                totalRent: propertyRent,
                maintenanceCost: propertyMaintenance,
                netRevenue: propertyRent - propertyMaintenance,
                roomCount: property.rooms ? property.rooms.length : 0,
                occupiedRooms: property.rooms ? property.rooms.filter(room => 
                    room.status === 'paid' || room.status === 'unpaid'
                ).length : 0
            };
        });

        const totalRent = revenueByProperty.reduce((sum, prop) => sum + prop.totalRent, 0);
        const totalMaintenance = revenueByProperty.reduce((sum, prop) => sum + prop.maintenanceCost, 0);

        res.status(200).send({
            data: {
                month: targetMonth,
                year: targetYear,
                summary: {
                    totalRent,
                    totalMaintenance,
                    netRevenue: totalRent - totalMaintenance
                },
                properties: revenueByProperty,
                maintenanceRecords
            },
            message: "Revenue details fetched successfully"
        });

    } catch (e) {
        console.error('Error fetching revenue details:', e);
        res.status(500).json({ error: 'Failed to fetch revenue details' });
    }
};

/**
 * Get detailed maintenance information for user properties
 */
const getMaintenanceDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { month, year, status } = req.query;

        // Default to current month/year if not provided
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        // Check if user exists
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Get all properties owned by the user
        const properties = await Property.findAll({
            where: { userId: id },
            attributes: ['id', 'name', 'location']
        });

        const propertyIds = properties.map(prop => prop.id);

        // Build maintenance query
        const maintenanceWhere = {
            propertyId: { [Op.in]: propertyIds }
        };

        // Add date filter if month/year provided
        if (month && year) {
            const startDate = new Date(targetYear, targetMonth - 1, 1);
            const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);
            maintenanceWhere.serviceDate = {
                [Op.between]: [startDate, endDate]
            };
        }

        // Add status filter if provided
        if (status && ['pending', 'in-progress', 'completed', 'cancelled'].includes(status)) {
            maintenanceWhere.status = status;
        }

        const maintenanceRecords = await MaintenanceRecord.findAll({
            where: maintenanceWhere,
            include: [
                {
                    model: Property,
                    as: 'property',
                    attributes: ['id', 'name', 'location']
                },
                {
                    model: Room,
                    as: 'room',
                    required: false,
                    attributes: ['id', 'number']
                }
            ],
            order: [['serviceDate', 'DESC']]
        });

        // Calculate maintenance statistics
        const totalCost = maintenanceRecords.reduce((sum, record) => {
            return sum + parseFloat(record.cost || 0);
        }, 0);

        const statusBreakdown = maintenanceRecords.reduce((acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
        }, {
            pending: 0,
            'in-progress': 0,
            completed: 0,
            cancelled: 0
        });

        // Group by property
        const maintenanceByProperty = properties.map(property => {
            const propertyRecords = maintenanceRecords.filter(record => 
                record.propertyId === property.id
            );
            
            const propertyCost = propertyRecords.reduce((sum, record) => 
                sum + parseFloat(record.cost || 0), 0
            );

            return {
                propertyId: property.id,
                propertyName: property.name,
                location: property.location,
                recordsCount: propertyRecords.length,
                totalCost: propertyCost,
                records: propertyRecords
            };
        });

        res.status(200).send({
            data: {
                month: targetMonth,
                year: targetYear,
                statusFilter: status || 'all',
                summary: {
                    totalRecords: maintenanceRecords.length,
                    totalCost,
                    statusBreakdown
                },
                properties: maintenanceByProperty,
                allRecords: maintenanceRecords
            },
            message: "Maintenance details fetched successfully"
        });

    } catch (e) {
        console.error('Error fetching maintenance details:', e);
        res.status(500).json({ error: 'Failed to fetch maintenance details' });
    }
};

/**
 * Get room occupancy details for user properties
 */
const getOccupancyDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Get all properties with their rooms
        const properties = await Property.findAll({
            where: { userId: id },
            include: [{
                model: Room,
                as: 'rooms',
                required: false,
                attributes: ['id', 'number', 'status', 'tenant', 'tenantContact', 'rent', 'rentDueDate']
            }],
            attributes: ['id', 'name', 'location', 'type', 'beds', 'baths']
        });

        // Calculate overall statistics
        const totalRooms = properties.reduce((sum, property) => {
            return sum + (property.rooms ? property.rooms.length : 0);
        }, 0);

        const occupiedRooms = properties.reduce((sum, property) => {
            if (property.rooms) {
                return sum + property.rooms.filter(room => 
                    room.status === 'paid' || room.status === 'unpaid'
                ).length;
            }
            return sum;
        }, 0);

        const vacantRooms = totalRooms - occupiedRooms;
        const overallOccupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

        // Calculate detailed breakdown by property
        const propertyBreakdown = properties.map(property => {
            const rooms = property.rooms || [];
            const propertyOccupiedRooms = rooms.filter(room => 
                room.status === 'paid' || room.status === 'unpaid'
            );
            
            const propertyVacantRooms = rooms.filter(room => room.status === 'vacant');
            const propertyOccupancyRate = rooms.length > 0 ? 
                Math.round((propertyOccupiedRooms.length / rooms.length) * 100) : 0;

            return {
                propertyId: property.id,
                propertyName: property.name,
                location: property.location,
                type: property.type,
                totalRooms: rooms.length,
                occupiedRooms: propertyOccupiedRooms.length,
                vacantRooms: propertyVacantRooms.length,
                occupancyRate: propertyOccupancyRate,
                rooms: rooms.map(room => ({
                    id: room.id,
                    number: room.number,
                    status: room.status,
                    tenant: room.tenant,
                    tenantContact: room.tenantContact,
                    rent: room.rent,
                    rentDueDate: room.rentDueDate
                }))
            };
        });

        // Calculate status breakdown
        const statusBreakdown = properties.reduce((acc, property) => {
            if (property.rooms) {
                property.rooms.forEach(room => {
                    acc[room.status] = (acc[room.status] || 0) + 1;
                });
            }
            return acc;
        }, {
            paid: 0,
            unpaid: 0,
            vacant: 0
        });

        res.status(200).send({
            data: {
                summary: {
                    totalProperties: properties.length,
                    totalRooms,
                    occupiedRooms,
                    vacantRooms,
                    overallOccupancyRate,
                    statusBreakdown
                },
                properties: propertyBreakdown
            },
            message: "Occupancy details fetched successfully"
        });

    } catch (e) {
        console.error('Error fetching occupancy details:', e);
        res.status(500).json({ error: 'Failed to fetch occupancy details' });
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
    validateCurrentPassword,
    getDashboard,
    getRevenueDetails,
    getMaintenanceDetails,
    getOccupancyDetails
}