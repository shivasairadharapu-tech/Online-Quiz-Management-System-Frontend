import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import resultService from '../services/resultService';
import quizService from '../services/quizService';
import StatCard from '../components/StatCard';
import QuizCard from '../components/QuizCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Trophy,
  Award,
  CheckCircle,
  BookOpen,
  Clock,
  Play,
  BarChart3,
  ChevronRight,
  Sparkles,
} from '../components/Icons';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [analyticsData, quizzesData] = await Promise.all([
          resultService.getMyAnalytics(),
          quizService.getPublishedQuizzes(),
        ]);
        setAnalytics(analyticsData);
        setQuizzes(quizzesData);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  const recentQuizzes = quizzes.slice(0, 3);

  return (
    <div className="dashboard-content">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="badge-pill">
            <Sparkles size={14} /> Student Portal
          </div>
          <h2>Welcome back, {user?.name || 'Student'}! 👋</h2>
          <p>
            Ready to test your programming skills today? Choose from available assessments or review your past attempts.
          </p>
        </div>
        <div className="welcome-actions">
          <Link to="/explore" className="btn btn-white btn-sm flex-btn">
            <Play size={16} />
            <span>Start a Quiz</span>
          </Link>
          <Link to="/history" className="btn btn-outline-white btn-sm flex-btn">
            <Clock size={16} />
            <span>View History</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="stats-grid mb-6">
        <StatCard
          title="Quizzes Attempted"
          value={analytics?.totalQuizzesAttempted || 0}
          subtitle="Completed assessments"
          icon={CheckCircle}
          color="blue"
        />
        <StatCard
          title="Average Score"
          value={`${analytics?.averageScore || 0}%`}
          subtitle="Overall performance"
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Highest Score"
          value={`${analytics?.highestScore || 0}%`}
          subtitle="Personal best"
          icon={Trophy}
          color="indigo"
        />
        <StatCard
          title="Available Quizzes"
          value={analytics?.availableQuizzes || quizzes.length}
          subtitle="Ready to take right now"
          icon={BookOpen}
          color="green"
        />
      </div>

      {/* Main Dashboard Layout: Left column (Recent Attempts & Performance) - Right column (Quick Quizzes) */}
      <div className="dashboard-two-col">
        {/* Left Column: Recent Quiz Attempts & Category Performance */}
        <div className="col-main">
          {/* Recent Quiz Attempts */}
          <div className="content-card mb-6">
            <div className="card-header-flex">
              <div>
                <h3>Recent Quiz Attempts</h3>
                <p className="card-subtitle">Your latest submitted tests</p>
              </div>
              <Link to="/history" className="btn btn-outline-primary btn-xs flex-btn">
                <span>View Full History</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {analytics?.recentAttempts && analytics.recentAttempts.length > 0 ? (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Quiz Title</th>
                      <th>Category</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentAttempts.map((attempt) => (
                      <tr key={attempt.attemptId}>
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
                        <td>
                          <span className="status-pill status-completed">Completed</span>
                        </td>
                        <td>
                          <Link
                            to={`/quiz/result/${attempt.attemptId}`}
                            className="btn btn-outline-primary btn-xs"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Clock size={36} />
                </div>
                <h4>No quiz attempts yet</h4>
                <p>You haven't attempted any quizzes so far. Select a quiz below to start learning!</p>
                <Link to="/explore" className="btn btn-primary btn-sm mt-3">
                  Explore Quizzes
                </Link>
              </div>
            )}
          </div>

          {/* Category Performance Breakdown */}
          {analytics?.categoryPerformance && Object.keys(analytics.categoryPerformance).length > 0 && (
            <div className="content-card">
              <div className="card-header-flex">
                <div>
                  <h3>Category-Wise Performance</h3>
                  <p className="card-subtitle">Your average scores per technical subject</p>
                </div>
                <BarChart3 size={20} className="text-muted" />
              </div>

              <div className="category-performance-list">
                {Object.entries(analytics.categoryPerformance).map(([cat, score]) => (
                  <div key={cat} className="perf-item">
                    <div className="perf-label-row">
                      <span className="perf-cat-name">{cat}</span>
                      <span className="perf-score">{score}%</span>
                    </div>
                    <div className="perf-progress-bar">
                      <div
                        className={`perf-progress-fill ${
                          score >= 75 ? 'fill-green' : score >= 50 ? 'fill-blue' : 'fill-orange'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recommended / Available Quizzes */}
        <div className="col-side">
          <div className="content-card">
            <div className="card-header-flex">
              <div>
                <h3>Available Quizzes</h3>
                <p className="card-subtitle">Start testing now</p>
              </div>
              <Link to="/explore" className="link-sm">
                View all
              </Link>
            </div>

            <div className="side-quiz-list">
              {recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="side-quiz-item">
                  <div className="side-quiz-meta">
                    <span className="side-quiz-cat">{quiz.category}</span>
                    <span className="side-quiz-diff">{quiz.difficulty}</span>
                  </div>
                  <h4 className="side-quiz-title">{quiz.title}</h4>
                  <div className="side-quiz-specs">
                    <span>
                      <Clock size={12} /> {quiz.durationMinutes || 10} mins
                    </span>
                    <span>
                      <BookOpen size={12} /> {quiz.questionCount || 5} MCQs
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-block mt-2 flex-btn"
                    onClick={() => navigate(`/quiz/take/${quiz.id}`)}
                  >
                    <Play size={14} />
                    <span>Start Quiz</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Links Card */}
          <div className="content-card mt-4">
            <h4 className="mb-3">Quick Navigation</h4>
            <div className="quick-links-stack">
              <Link to="/explore" className="quick-link-item">
                <BookOpen size={16} />
                <span>Explore All Categories</span>
                <ChevronRight size={14} />
              </Link>
              <Link to="/leaderboard" className="quick-link-item">
                <Trophy size={16} />
                <span>View Campus Leaderboard</span>
                <ChevronRight size={14} />
              </Link>
              <Link to="/profile" className="quick-link-item">
                <Award size={16} />
                <span>My Profile & Stats</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
