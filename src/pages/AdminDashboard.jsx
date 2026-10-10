import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import resultService from '../services/resultService';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  Layers,
  CheckCircle,
  BarChart3,
  BookOpen,
  Plus,
  Shield,
  ChevronRight,
  Sparkles,
} from '../components/Icons';

export const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const data = await resultService.getAdminDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading admin analytics & dashboard metrics..." />;
  }

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="admin-dashboard-banner">
        <div>
          <div className="badge-pill inline-flex mb-2">
            <Shield size={14} /> Control Center
          </div>
          <h2>Administrator Portal</h2>
          <p className="text-muted">
            Manage quizzes, configure multiple-choice questions, monitor student performance, and examine assessment metrics.
          </p>
        </div>
        <div className="admin-banner-actions">
          <Link to="/admin/quizzes" className="btn btn-primary btn-sm flex-btn">
            <Plus size={16} />
            <span>Create Quiz</span>
          </Link>
          <Link to="/admin/questions" className="btn btn-outline-primary btn-sm flex-btn">
            <BookOpen size={16} />
            <span>Manage MCQs</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Row */}
      <div className="stats-grid mb-8">
        <StatCard
          title="Registered Students"
          value={dashboardData?.totalStudents || 0}
          subtitle="Active student accounts"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Quizzes"
          value={dashboardData?.totalQuizzes || 0}
          subtitle={`${dashboardData?.publishedQuizzes || 0} Published`}
          icon={Layers}
          color="purple"
        />
        <StatCard
          title="Completed Attempts"
          value={dashboardData?.totalCompletedAttempts || 0}
          subtitle="Tests submitted & graded"
          icon={CheckCircle}
          color="indigo"
        />
        <StatCard
          title="Platform Average"
          value={`${dashboardData?.platformAveragePercentage || 0}%`}
          subtitle="Overall student score"
          icon={BarChart3}
          color="green"
        />
      </div>

      {/* Dashboard Two-Column Grid */}
      <div className="dashboard-two-col">
        {/* Left Column: Recent Quiz Submissions */}
        <div className="col-main">
          <div className="content-card mb-6">
            <div className="card-header-flex">
              <div>
                <h3>Recent Student Quiz Attempts</h3>
                <p className="card-subtitle">Real-time student submissions from MySQL</p>
              </div>
              <Link to="/admin/results" className="btn btn-outline-primary btn-xs flex-btn">
                <span>View All Results</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {dashboardData?.recentAttempts && dashboardData.recentAttempts.length > 0 ? (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Quiz Title</th>
                      <th>Category</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentAttempts.map((attempt) => (
                      <tr key={attempt.id}>
                        <td>
                          <div className="student-cell">
                            <span className="font-semibold">{attempt.studentName}</span>
                            <span className="text-muted text-xs">{attempt.studentEmail}</span>
                          </div>
                        </td>
                        <td className="font-semibold">{attempt.quizTitle}</td>
                        <td>
                          <span className="badge badge-light">{attempt.category}</span>
                        </td>
                        <td>
                          {attempt.score} / {attempt.totalMarks}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              attempt.percentage >= 75
                                ? 'badge-success'
                                : attempt.percentage >= 50
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                          >
                            {attempt.percentage}%
                          </span>
                        </td>
                        <td className="text-muted text-xs">
                          {attempt.attemptedAt ? new Date(attempt.attemptedAt).toLocaleDateString() : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p className="text-muted">No student attempts recorded yet.</p>
              </div>
            )}
          </div>

          {/* Category Distribution Breakdown */}
          {dashboardData?.categoryDistribution && Object.keys(dashboardData.categoryDistribution).length > 0 && (
            <div className="content-card">
              <div className="card-header-flex">
                <div>
                  <h3>Domain Quiz Distribution</h3>
                  <p className="card-subtitle">Number of quizzes configured per technical subject</p>
                </div>
                <Layers size={20} className="text-muted" />
              </div>

              <div className="category-performance-list">
                {Object.entries(dashboardData.categoryDistribution).map(([cat, count]) => (
                  <div key={cat} className="perf-item">
                    <div className="perf-label-row">
                      <span className="perf-cat-name">{cat}</span>
                      <span className="perf-score">{count} Quizzes</span>
                    </div>
                    <div className="perf-progress-bar">
                      <div
                        className="perf-progress-fill fill-purple"
                        style={{ width: `${Math.min(100, count * 15)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Quick Administration Shortcuts */}
        <div className="col-side">
          <div className="content-card">
            <h3 className="mb-3">Quick Actions</h3>
            <div className="admin-actions-stack">
              <Link to="/admin/quizzes" className="admin-action-btn">
                <div className="action-icon bg-blue">
                  <Layers size={18} />
                </div>
                <div className="action-text">
                  <b>Manage Quizzes</b>
                  <span>Create, edit, toggle publish status</span>
                </div>
              </Link>

              <Link to="/admin/questions" className="admin-action-btn">
                <div className="action-icon bg-purple">
                  <BookOpen size={18} />
                </div>
                <div className="action-text">
                  <b>Question Bank</b>
                  <span>Add, modify, and delete MCQ options</span>
                </div>
              </Link>

              <Link to="/admin/students" className="admin-action-btn">
                <div className="action-icon bg-indigo">
                  <Users size={18} />
                </div>
                <div className="action-text">
                  <b>Student Management</b>
                  <span>View registered student records</span>
                </div>
              </Link>

              <Link to="/admin/results" className="admin-action-btn">
                <div className="action-icon bg-green">
                  <CheckCircle size={18} />
                </div>
                <div className="action-text">
                  <b>Assessment Results</b>
                  <span>Filter by quiz and inspect score history</span>
                </div>
              </Link>
            </div>
          </div>

          {/* System Specs Box */}
          <div className="content-card mt-4">
            <h4 className="mb-3">System Specifications</h4>
            <div className="spec-item-row">
              <span>Backend Engine:</span>
              <b>Spring Boot 3.5.6</b>
            </div>
            <div className="spec-item-row">
              <span>Database Server:</span>
              <b>MySQL 5.6 (Active)</b>
            </div>
            <div className="spec-item-row">
              <span>Auth Protocol:</span>
              <b>JWT + BCrypt</b>
            </div>
            <div className="spec-item-row">
              <span>Frontend Client:</span>
              <b>React 18 + Vite</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
