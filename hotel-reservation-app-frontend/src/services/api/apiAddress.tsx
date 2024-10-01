// api.ts
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth'; // Assumed path to your custom hook
import React from 'react';

// Create the axios instance
export const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the Authorization header based on authentication
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Custom hook to set token automatically when auth state changes
export const useSetupAxios = () => {
  const { auth } = useAuth();

  React.useEffect(() => {
    setAuthToken(auth?.token || null);
  }, [auth]);

  // Optionally, you could handle response errors globally here
  // or add request interceptors if needed
  api.interceptors.response.use(
    response => response,
    error => {
      // Handle errors globally if needed
      if (error.response && error.response.status === 401) {
        // Unauthorized error handling
        // For example, redirect to login page
      }
      return Promise.reject(error);
    }
  );
};

export default api;
