import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { auth, loading } = useAuth();  // Destructure loading state

  if (loading) {
    // While loading, show a loading spinner or similar
    return <div>Loading...</div>;
  }

  if (!auth?.token) {
    console.log('User not authenticated:', auth?.token);
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !auth.roles.some(role => allowedRoles.includes(role))) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};
