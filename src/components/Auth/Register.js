import React, { useState } from 'react';
import authService from '../../services/authService';
import { isValidEmail, validatePassword, validateUsername } from '../../utils/validation';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    // Validate username
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      throw new Error(usernameValidation.message);
    }
    
    // Validate email
    if (!formData.email.trim()) {
      throw new Error('Email is required');
    }
    if (!isValidEmail(formData.email)) {
      throw new Error('Invalid email format');
    }
    
    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      validateForm();

      const { username, email, password } = formData;
      const data = await authService.register({ username, email, password });
      
      // Clear sensitive data
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      
      if (onRegisterSuccess) {
        onRegisterSuccess(data);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      // Clear passwords on error
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div role="alert" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            autoComplete="username"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            autoComplete="email"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
            minLength="8"
            required
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
