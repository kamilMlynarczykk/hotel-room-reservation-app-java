import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../hooks/useAuth'; // Update this import path as needed
import { useSetupAxios } from '../services/api/apiAddress';
import { loginRequest } from '../services/api/AuthenticationRequests';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  useSetupAxios();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, token, roles, status } = await loginRequest(username, password);
      if (status === 200) {
        login(Number(id), token, roles);
        navigate('/rooms');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setError('No Server Response');
        } else if (error.response.status === 400) {
          setError('Missing username or password');
        } else if (error.response.status === 401) {
          setError('Unauthorized');
        } else {
          setError('Login failed');
        }
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  // Redirect to register page on link click
  const handleRegisterRedirect = () => {
    navigate('/register'); // Assumes you have routing set up to handle '/register'
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Login</h2>
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
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100 mb-3">
          Login
        </button>
        <p className="text-center">
          Don't have an account?{' '}
          </p>
            <p className="text-center">
                <span
                  className="text-primary"
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={handleRegisterRedirect}
                >
                  Register here
                </span>
            </p>
      </form>
    </div>
  );
};
