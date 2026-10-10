import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import resultService from '../services/resultService';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import {
  Clock,
  Award,
  Trophy,
  CheckCircle,
  BarChart3,
  BookOpen,
  ChevronRight,
} from '../components/Icons';

export const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        const [histData, analData] = await Promise.all([
          resultService.getMyHistory(),
          resultService.getMyAnalytics(),
        ]);
        setHistory(histData);
        setAnalytics(analData);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistoryData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading quiz history & performance analytics..." />;
  }

  return (
    <div className="section-container py-8">
      {/* Header */}
      <div className="page-header mb-8">
        <div>
          <span className="section-subtitle">Records</span>
          <h1 className="page-title">My Quiz History & Analytics</h1>
          <p className="text-muted">
            Track your past attempts, evaluate score progressions, and review full question keys.
          </p>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="stats-grid mb-8">
        <StatCard
          title="Total Attempts"
          value={analytics?.totalQuizzesAttempted || history.length}
          subtitle="Tests completed"
          icon={CheckCircle}
          color="blue"
        />
        <StatCard
          title="Average Score"
          value={`${analytics?.averageScore || 0}%`}
          subtitle="Overall mean accuracy"
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Best Performance"
          value={`${analytics?.highestScore || 0}%`}
          subtitle="Highest scored quiz"
          icon={Trophy}
          color="indigo"
        />
        <StatCard
          title="Available Catalog"
          value={analytics?.availableQuizzes || 12}
          subtitle="Ready to take"
          icon={BookOpen}
          color="green"
        />
      </div>

      {/* Score Trend Visual Chart (SVG Based for responsive rendering) */}
      {analytics?.scoreTrends && analytics.scoreTrends.length > 1 && (
        <div className="content-card mb-8">
          <div className="card-header-flex">
            <div>
              <h3>Score Progression Trend</h3>
              <p className="card-subtitle">Chronological progression of your quiz scores</p>
            </div>
            <BarChart3 size={20} className="text-muted" />
          </div>

          <div className="trend-chart-container">
            <div className="trend-bars-wrapper">
              {analytics.scoreTrends.map((point, index) => {
                const pct = Math.min(100, Math.max(0, point.percentage || 0));
                return (
                  <div key={index} className="trend-bar-col">
                    <div className="trend-bar-val">{pct}%</div>
                    <div className="trend-bar-track">
                      <div
                        className={`trend-bar-fill ${pct >= 75 ? 'fill-green' : pct >= 50 ? 'fill-blue' : 'fill-orange'}`}
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <div className="trend-bar-label" title={point.quizTitle}>
                      #{index + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quiz History Table */}
      <div className="content-card">
        <div className="card-header-flex mb-4">
          <div>
            <h3>All Past Quiz Attempts</h3>
            <p className="card-subtitle">Full historical logs stored in MySQL</p>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => {
                  const dateStr = item.attemptedAt
                    ? new Date(item.attemptedAt).toLocaleString()
                    : 'Recent';

                  return (
                    <tr key={item.id}>
                      <td className="font-semibold">{item.quizTitle}</td>
                      <td>
                        <span className="badge badge-light">{item.category}</span>
                      </td>
                      <td className="text-muted">{dateStr}</td>
                      <td>
                        <b>{item.score}</b> / {item.totalMarks}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.percentage >= 75
                              ? 'badge-success'
                              : item.percentage >= 50
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {item.percentage}%
                        </span>
                      </td>
                      <td>
                        <span className="status-pill status-completed">Completed</span>
                      </td>
                      <td>
                        <Link
                          to={`/quiz/result/${item.attemptId || item.id}`}
                          className="btn btn-outline-primary btn-xs flex-btn"
                        >
                          <span>Review Answers</span>
                          <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Clock size={40} className="text-muted mb-3" />
            <h3>No quiz attempts recorded</h3>
            <p className="text-muted">
              You haven't completed any quizzes yet. Start an assessment to see your history and performance analytics here.
            </p>
            <Link to="/explore" className="btn btn-primary btn-sm mt-4">
              Explore Quizzes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
