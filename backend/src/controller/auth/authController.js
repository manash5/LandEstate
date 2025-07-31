import { User } from "../../models/index.js";
import { generateToken } from "../../security/jwt-util.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Op } from "sequelize";
import { sendLoginNotification, sendPasswordResetEmail } from "../../utils/sendMail.js";

const login = async (req, res) => {
  try {
    //fetching all the data from users table
    if (req.body.email == null) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (req.body.password == null) {
      return res.status(400).send({ message: "Password is required" });
    }
    
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).send({ message: "No account found with this email address" });
    }
    
    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (isPasswordValid) {
      const token = generateToken({ 
        user: user.toJSON(),
        id: user.id,
        email: user.email,
        type: 'admin'
      });
      // Send login notification email (non-blocking)
      sendLoginNotification(user.email).catch((err) => {
        console.error('Failed to send login notification email:', err);
      });
      return res.status(200).send({
        data: { access_token: token },
        message: "Successfully logged in",
      });
    } else {
      return res.status(401).send({ message: "Incorrect password" });
    }
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

/**
 *  init
 */

const init = async (req, res) => {
  try {
    console.log('Init endpoint called');
    console.log('req.user:', req.user);
    
    if (!req.user) {
      console.error('No user found in request');
      return res.status(401).json({ error: "No user found in request" });
    }
    
    if (!req.user.user) {
      console.error('No user data in req.user:', req.user);
      return res.status(401).json({ error: "Invalid user data structure" });
    }
    
    // Fetch complete user data from database instead of using JWT token data
    const userId = req.user.user.id;
    const user = await User.findByPk(userId);
    
    if (!user) {
      console.error('User not found in database');
      return res.status(404).json({ error: "User not found" });
    }
    
    console.log('User data from database:', user.toJSON());
    
    // Convert to JSON and remove password
    const userData = user.toJSON();
    delete userData.password;
    
    res
      .status(200)
      .send({ data: userData, message: "successfully fetched current user" });
  } catch (e) {
    console.error('Error in init endpoint:', e);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

/**
 * Check if email exists for forgot password
 */
const forgotPassword = async (req, res) => {
  try {
    if (req.body.email == null) {
      return res.status(400).send({ message: "Email is required" });
    }
    
    const user = await User.findOne({ where: { email: req.body.email } });
    
    if (!user) {
      return res.status(404).send({ message: "No account found with this email address" });
    }
    
    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    console.log('Generated reset token:', resetToken);
    console.log('Token expiry:', resetTokenExpiry);
    
    // Save reset token to user
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry
    });
    
    console.log('Token saved to user:', user.id);
    
    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
      console.log('Password reset email sent successfully');
      return res.status(200).send({ 
        message: "Password reset email sent successfully" 
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return res.status(500).send({ 
        message: "Failed to send password reset email. Please try again." 
      });
    }
    
  } catch (e) {
    console.error('Error in forgot password:', e);
    res.status(500).json({ error: "Failed to process forgot password request" });
  }
};

/**
 * Reset password with token
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).send({ message: "Token and new password are required" });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).send({ message: "Password must be at least 6 characters long" });
    }
    
    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      }
    });
    
    if (!user) {
      return res.status(400).send({ message: "Invalid or expired reset token" });
    }
    
    // Update password and clear reset token
    await user.update({
      password: newPassword, // This will be hashed by the beforeUpdate hook
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    
    return res.status(200).send({ 
      message: "Password reset successfully" 
    });
    
  } catch (e) {
    console.error('Error in reset password:', e);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

/**
 * Reset password with token from email form
 */
const resetPasswordForm = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).send(`
        <html>
          <head>
            <title>Password Reset - Error</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; color: #c00; }
              .button { display: inline-block; background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h2>❌ Error</h2>
              <p>All fields are required. Please go back and fill in both password fields.</p>
              <a href="javascript:history.back()" class="button">Go Back</a>
            </div>
          </body>
        </html>
      `);
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).send(`
        <html>
          <head>
            <title>Password Reset - Error</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; color: #c00; }
              .button { display: inline-block; background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h2>❌ Passwords Don't Match</h2>
              <p>The passwords you entered do not match. Please try again.</p>
              <a href="javascript:history.back()" class="button">Go Back</a>
            </div>
          </body>
        </html>
      `);
    }
    
    if (newPassword.length < 6) {
      return res.status(400).send(`
        <html>
          <head>
            <title>Password Reset - Error</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; color: #c00; }
              .button { display: inline-block; background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h2>❌ Password Too Short</h2>
              <p>Password must be at least 6 characters long.</p>
              <a href="javascript:history.back()" class="button">Go Back</a>
            </div>
          </body>
        </html>
      `);
    }
    
    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });
    
    if (!user) {
      return res.status(400).send(`
        <html>
          <head>
            <title>Password Reset - Error</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; color: #c00; }
              .button { display: inline-block; background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h2>❌ Invalid or Expired Link</h2>
              <p>This password reset link is invalid or has expired. Please request a new password reset.</p>
              <a href="http://localhost:5173/forgotpass" class="button">Request New Reset</a>
            </div>
          </body>
        </html>
      `);
    }
    
    // Update password and clear reset token
    await user.update({
      password: newPassword, // This will be hashed by the beforeUpdate hook
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    
    return res.status(200).send(`
      <html>
        <head>
          <title>Password Reset - Success</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .success { background: #efe; border: 1px solid #cfc; padding: 20px; border-radius: 8px; color: #060; }
            .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .logo { text-align: center; margin-bottom: 20px; }
            .logo h1 { color: #0F6D94; margin: 0; }
          </style>
        </head>
        <body>
          <div class="logo">
            <h1>🏠 LandEstate</h1>
          </div>
          <div class="success">
            <h2>✅ Password Reset Successful!</h2>
            <p>Your password has been successfully updated. You can now log in with your new password.</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <a href="http://localhost:5173/login" class="button">Go to Login</a>
          </div>
        </body>
      </html>
    `);
    
  } catch (e) {
    console.error('Error in reset password form:', e);
    return res.status(500).send(`
      <html>
        <head>
          <title>Password Reset - Error</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; color: #c00; }
          </style>
        </head>
        <body>
          <div class="error">
            <h2>❌ Server Error</h2>
            <p>Something went wrong. Please try again later.</p>
          </div>
        </body>
      </html>
    `);
  }
};

/**
 * Verify reset token
 */
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    console.log('Verifying reset token:', token);
    
    if (!token) {
      console.log('No token provided');
      return res.status(400).send({ message: "Token is required" });
    }
    
    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      }
    });
    
    console.log('User found with token:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User email:', user.email);
      console.log('Token expires at:', user.resetPasswordExpires);
      console.log('Current time:', new Date());
    }
    
    if (!user) {
      console.log('Invalid or expired token');
      return res.status(400).send({ message: "Invalid or expired reset token" });
    }
    
    console.log('Token is valid, returning success');
    return res.status(200).send({ 
      message: "Token is valid",
      email: user.email 
    });
    
  } catch (e) {
    console.error('Error in verify reset token:', e);
    res.status(500).json({ error: "Failed to verify reset token" });
  }
};

export const authController = {
  login,
  init,
  forgotPassword,
  resetPassword,
  verifyResetToken,
};
