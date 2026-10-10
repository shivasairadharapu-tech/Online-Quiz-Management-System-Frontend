import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export const DashboardLayout = ({ requiredRole }) => {
  const { user, loading, isAdmin, isStudent } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Authenticating session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === 'STUDENT' && !isStudent && !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="app-shell dashboard-shell">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar type={requiredRole === 'ADMIN' || isAdmin ? 'admin' : 'student'} />
        <main className="dashboard-main-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
