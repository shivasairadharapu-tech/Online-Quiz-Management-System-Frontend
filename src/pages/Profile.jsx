import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import resultService from '../services/resultService';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import {
  UserIcon,
  Shield,
  Award,
  CheckCircle,
  Trophy,
  Clock,
} from '../components/Icons';

export const Profile = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        const data = await resultService.getMyAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading profile details..." />;
  }

  return (
    <div className="section-container py-8">
      <div className="page-header mb-8">
        <div>
          <span className="section-subtitle">Account</span>
          <h1 className="page-title">My Profile & Academic Portfolio</h1>
          <p className="text-muted">Manage your student credentials and overview assessment achievements.</p>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* User Identity Card */}
        <div className="content-card profile-card">
          <div className="profile-avatar-large">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>

          <div className="profile-role-pill">
            {user?.role === 'ADMIN' ? <Shield size={14} /> : <UserIcon size={14} />}
            <span>Role: {user?.role}</span>
          </div>

          <div className="profile-info-divider" />

          <div className="profile-detail-rows">
            <div className="detail-row">
              <span className="detail-label">User ID:</span>
              <span className="detail-val">#{user?.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Status:</span>
              <span className="detail-val text-success">Active & Verified</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Security Protocol:</span>
              <span className="detail-val">JWT + BCrypt Encrypted</span>
            </div>
          </div>
        </div>

        {/* Academic Analytics Summary */}
        <div className="content-card profile-stats-card">
          <h3 className="mb-4">Quiz Assessment Performance</h3>

          <div className="stats-grid mb-6">
            <StatCard
              title="Completed Tests"
              value={analytics?.totalQuizzesAttempted || 0}
              icon={CheckCircle}
              color="blue"
            />
            <StatCard
              title="Average Percentage"
              value={`${analytics?.averageScore || 0}%`}
              icon={Award}
              color="purple"
            />
            <StatCard
              title="Personal Best"
              value={`${analytics?.highestScore || 0}%`}
              icon={Trophy}
              color="indigo"
            />
          </div>

          {/* Subject Mastery List */}
          {analytics?.categoryPerformance && Object.keys(analytics.categoryPerformance).length > 0 && (
            <div>
              <h4 className="mb-3">Subject Breakdown</h4>
              <div className="category-performance-list">
                {Object.entries(analytics.categoryPerformance).map(([cat, score]) => (
                  <div key={cat} className="perf-item">
                    <div className="perf-label-row">
                      <span className="perf-cat-name">{cat}</span>
                      <span className="perf-score">{score}%</span>
                    </div>
                    <div className="perf-progress-bar">
                      <div
                        className="perf-progress-fill fill-blue"
                        style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
