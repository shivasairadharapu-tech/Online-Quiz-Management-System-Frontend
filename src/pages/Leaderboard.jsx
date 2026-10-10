import React, { useEffect, useState } from 'react';
import resultService from '../services/resultService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trophy, Award, CheckCircle, Sparkles } from '../components/Icons';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await resultService.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching student rankings..." />;
  }

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="section-container py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="badge-pill inline-flex mb-3">
          <Sparkles size={14} /> Competitive Standings
        </div>
        <h1 className="page-title">Campus Quiz Leaderboard</h1>
        <p className="text-muted max-w-xl mx-auto">
          Celebrating top academic achievers based on total assessment score and completed quiz mastery.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && (
        <div className="podium-grid mb-10">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="podium-card podium-silver">
              <div className="podium-badge">🥈 2nd</div>
              <div className="podium-avatar">
                {top3[1].studentName?.charAt(0).toUpperCase()}
              </div>
              <h3>{top3[1].studentName}</h3>
              <div className="podium-score">{top3[1].totalScore} pts</div>
              <div className="podium-meta">
                <span>{top3[1].completedQuizzes} Quizzes</span> &bull;{' '}
                <span>{top3[1].averagePercentage}% Avg</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <div className="podium-card podium-gold primary-rank">
              <div className="gold-crown">👑</div>
              <div className="podium-badge">🥇 1st</div>
              <div className="podium-avatar">
                {top3[0].studentName?.charAt(0).toUpperCase()}
              </div>
              <h3>{top3[0].studentName}</h3>
              <div className="podium-score">{top3[0].totalScore} pts</div>
              <div className="podium-meta">
                <span>{top3[0].completedQuizzes} Quizzes</span> &bull;{' '}
                <span>{top3[0].averagePercentage}% Avg</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="podium-card podium-bronze">
              <div className="podium-badge">🥉 3rd</div>
              <div className="podium-avatar">
                {top3[2].studentName?.charAt(0).toUpperCase()}
              </div>
              <h3>{top3[2].studentName}</h3>
              <div className="podium-score">{top3[2].totalScore} pts</div>
              <div className="podium-meta">
                <span>{top3[2].completedQuizzes} Quizzes</span> &bull;{' '}
                <span>{top3[2].averagePercentage}% Avg</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Full Table */}
      <div className="content-card">
        <div className="card-header-flex mb-4">
          <div>
            <h3>Overall Student Standings</h3>
            <p className="card-subtitle">Ranked by total score obtained across all tests</p>
          </div>
          <Trophy size={20} className="text-warning" />
        </div>

        {leaderboard.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Rank</th>
                  <th>Student Name</th>
                  <th>Quizzes Completed</th>
                  <th>Total Score</th>
                  <th>Possible Marks</th>
                  <th>Average Percentage</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.studentId} className={entry.rank <= 3 ? 'highlight-row' : ''}>
                    <td>
                      <span className={`rank-pill rank-${entry.rank}`}>
                        {entry.rank === 1 ? '🥇 1' : entry.rank === 2 ? '🥈 2' : entry.rank === 3 ? '🥉 3' : `#${entry.rank}`}
                      </span>
                    </td>
                    <td className="font-semibold">{entry.studentName}</td>
                    <td>
                      <span className="badge badge-light">{entry.completedQuizzes} Completed</span>
                    </td>
                    <td className="text-primary font-bold">{entry.totalScore} pts</td>
                    <td className="text-muted">{entry.totalPossibleMarks} pts</td>
                    <td>
                      <span
                        className={`badge ${
                          entry.averagePercentage >= 75
                            ? 'badge-success'
                            : entry.averagePercentage >= 50
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {entry.averagePercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Trophy size={40} className="text-muted mb-3" />
            <h3>Leaderboard is currently empty</h3>
            <p className="text-muted">
              Complete quiz assessments to score points and be featured on the campus leaderboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
