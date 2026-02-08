import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../App';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'customer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user } = useStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    // Redirect to home if user doesn't have required permissions
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};