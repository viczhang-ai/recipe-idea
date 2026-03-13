import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f6]">
        <div className="w-8 h-8 border-4 border-[#ec5b13] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile || !profile.is_admin) {
    console.warn('Access denied: User is not an admin');
    return <Navigate to="/main" replace />;
  }

  return <>{children}</>;
};
