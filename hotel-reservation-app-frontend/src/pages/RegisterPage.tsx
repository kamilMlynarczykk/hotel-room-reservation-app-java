import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useSetupAxios } from '../services/api/apiAddress';
import { register } from '../services/api/AuthenticationRequests';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useSetupAxios();

  // Helper function to validate username
  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9]{4,}$/; // At least 5 characters, starting with a letter or number
    return usernameRegex.test(username);
  };

  // Helper function to validate password
  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,/;'=-])[A-Za-z\d@$!%*?&]{8,}$/; // At least 8 characters, with at least one uppercase, lowercase, number, and special character
    return passwordRegex.test(password);
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      setError('Username must be at least 5 characters long and start with a letter or number.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Send a POST request to the register endpoint
      const response = await register(username, password);
      console.log(response);

      if (response.status === 200) {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        alert('Registration successful! You can now log in.');
        navigate("/login");
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="w-25 mx-auto">
        <div className="form-group mb-3">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter username"
            autoComplete="off"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
            autoComplete="off"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Re-enter password"
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
