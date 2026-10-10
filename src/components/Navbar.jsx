import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Award, LogOut, UserIcon, Shield, Trophy } from './Icons';

export const Navbar = () => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Award size={22} />
          </div>
          <span className="brand-name">QuizMaster</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Home
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Explore Quizzes
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Leaderboard
          </NavLink>

          {user && isStudent && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                My Dashboard
              </NavLink>
              <NavLink to="/history" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                History
              </NavLink>
            </>
          )}

          {user && isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* User / Auth Actions */}
        <div className="nav-actions">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-profile-badge">
                <div className="avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info-text">
                  <span className="user-display-name">{user.name}</span>
                  <span className="user-role-badge">
                    {isAdmin ? <Shield size={10} /> : null} {user.role}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm logout-btn"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={16} />
                <span className="hide-mobile">Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/explore" onClick={() => setMobileMenuOpen(false)}>
            Explore Quizzes
          </NavLink>
          <NavLink to="/leaderboard" onClick={() => setMobileMenuOpen(false)}>
            Leaderboard
          </NavLink>
          {user && isStudent && (
            <>
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                My Dashboard
              </NavLink>
              <NavLink to="/history" onClick={() => setMobileMenuOpen(false)}>
                Quiz History
              </NavLink>
              <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                My Profile
              </NavLink>
            </>
          )}
          {user && isAdmin && (
            <>
              <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>
                Admin Dashboard
              </NavLink>
              <NavLink to="/admin/quizzes" onClick={() => setMobileMenuOpen(false)}>
                Manage Quizzes
              </NavLink>
              <NavLink to="/admin/questions" onClick={() => setMobileMenuOpen(false)}>
                Manage Questions
              </NavLink>
              <NavLink to="/admin/students" onClick={() => setMobileMenuOpen(false)}>
                Student Results
              </NavLink>
            </>
          )}
          {user ? (
            <button
              type="button"
              className="btn btn-danger btn-sm w-full mt-3"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <div className="mobile-auth-actions mt-3">
              <Link to="/login" className="btn btn-outline-primary w-full" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
