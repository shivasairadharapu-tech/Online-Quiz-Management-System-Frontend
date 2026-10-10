import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Compass,
  HistoryIcon,
  Trophy,
  UserIcon,
  Layers,
  BookOpen,
  Users,
  BarChart3,
  LogOut,
  Shield,
} from './Icons';

export const Sidebar = ({ type = 'student' }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/explore', label: 'Explore Quizzes', icon: Compass },
    { to: '/history', label: 'My Quiz History', icon: HistoryIcon },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/profile', label: 'My Profile', icon: UserIcon },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: Home },
    { to: '/admin/quizzes', label: 'Manage Quizzes', icon: Layers },
    { to: '/admin/questions', label: 'Manage Questions', icon: BookOpen },
    { to: '/admin/students', label: 'Manage Students', icon: Users },
    { to: '/admin/results', label: 'Student Results', icon: HistoryIcon },
    { to: '/admin/analytics', label: 'Platform Analytics', icon: BarChart3 },
  ];

  const links = type === 'admin' || (isAdmin && type !== 'student') ? adminLinks : studentLinks;

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-role-badge">
          {type === 'admin' ? (
            <>
              <Shield size={14} />
              <span>Admin Workspace</span>
            </>
          ) : (
            <>
              <UserIcon size={14} />
              <span>Student Portal</span>
            </>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/dashboard'}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-brief">
          <div className="avatar-small">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-text-small">
            <span className="user-name-truncated">{user?.name}</span>
            <span className="user-email-truncated">{user?.email}</span>
          </div>
        </div>
        <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
