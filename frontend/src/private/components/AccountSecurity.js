// Frontend integration examples for Account & Security features

/**
 * User Account Service
 * Handles all account-related API calls
 */
class UserAccountService {
  constructor() {
    this.baseURL = '/api/user';
    this.token = localStorage.getItem('authToken');
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  // Get user profile
  async getProfile(userId) {
    try {
      const response = await fetch(`${this.baseURL}/${userId}/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Update account information
  async updateAccountInfo(userId, accountData) {
    try {
      const response = await fetch(`${this.baseURL}/${userId}/account-info`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(accountData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update account');
      }

      return data.data;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(userId, passwordData) {
    try {
      const response = await fetch(`${this.baseURL}/${userId}/change-password`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      return data.message;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Validate current password
  async validatePassword(userId, password) {
    try {
      const response = await fetch(`${this.baseURL}/${userId}/validate-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to validate password');
      }

      return data.isValid;
    } catch (error) {
      console.error('Error validating password:', error);
      throw error;
    }
  }

  // Update profile image
  async updateProfileImage(userId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('profileImage', imageFile);

      const response = await fetch(`${this.baseURL}/${userId}/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
          // Don't set Content-Type for FormData, let browser set it
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile image');
      }

      return data;
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  }
}

/**
 * React Hook for Account Management
 * Custom hook for managing user account state and operations
 */
import { useState, useEffect } from 'react';

export const useUserAccount = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const userService = new UserAccountService();

  // Load user profile
  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await userService.getProfile(userId);
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update account info
  const updateAccount = async (accountData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateAccountInfo(userId, accountData);
      setUser(updatedUser);
      return { success: true, message: 'Account updated successfully' };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      const message = await userService.changePassword(userId, passwordData);
      return { success: true, message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Validate password
  const validatePassword = async (password) => {
    try {
      return await userService.validatePassword(userId, password);
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Update profile image
  const updateProfileImage = async (imageFile) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.updateProfileImage(userId, imageFile);
      setUser(prev => ({ ...prev, profileImage: result.imagePath }));
      return { success: true, message: result.message };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    updateAccount,
    changePassword,
    validatePassword,
    updateProfileImage,
    refetchProfile: loadProfile
  };
};

/**
 * React Component Example - Account Settings
 */
import React, { useState } from 'react';

export const AccountSettings = ({ userId }) => {
  const { 
    user, 
    loading, 
    error, 
    updateAccount, 
    changePassword, 
    validatePassword 
  } = useUserAccount(userId);

  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [message, setMessage] = useState('');

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setAccountForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  // Handle account info update
  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    const result = await updateAccount(accountForm);
    setMessage(result.message);
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    const result = await changePassword(passwordForm);
    setMessage(result.message);
    
    if (result.success) {
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="account-settings">
      <h2>Account Settings</h2>
      
      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Account Information Section */}
      <section>
        <h3>Account Information</h3>
        <form onSubmit={handleAccountUpdate}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={accountForm.name}
              onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={accountForm.email}
              onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <label>Phone:</label>
            <input
              type="tel"
              value={accountForm.phone}
              onChange={(e) => setAccountForm(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          
          <div>
            <label>Address:</label>
            <textarea
              value={accountForm.address}
              onChange={(e) => setAccountForm(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
          
          <button type="submit" disabled={loading}>
            Update Account
          </button>
        </form>
      </section>

      {/* Security Section */}
      <section>
        <h3>Security</h3>
        
        {!showPasswordSection ? (
          <button onClick={() => setShowPasswordSection(true)}>
            Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordChange}>
            <div>
              <label>Current Password:</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label>New Password:</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label>Confirm New Password:</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>
            
            <button type="submit" disabled={loading}>
              Change Password
            </button>
            <button type="button" onClick={() => setShowPasswordSection(false)}>
              Cancel
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default AccountSettings;
