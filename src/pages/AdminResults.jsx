import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import resultService from '../services/resultService';
import quizService from '../services/quizService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HistoryIcon,
  Search,
  Filter,
  ChevronRight,
  BookOpen,
} from '../components/Icons';

export const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizService.getAllQuizzesAdmin();
        setQuizzes(data);
      } catch (err) {
        console.error('Error fetching quizzes for filter:', err);
      }
    };
    fetchQuizzes();
  }, []);

  const fetchResults = async () => {
    try {
      const data = await resultService.getAdminResults(selectedQuizId, search);
      setResults(data);
    } catch (err) {
      console.error('Error fetching admin results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [selectedQuizId, search]);

  if (loading) {
    return <LoadingSpinner text="Fetching student assessment results..." />;
  }

  return (
    <div className="section-container py-8">
      <div className="card-header-flex mb-6">
        <div>
          <span className="section-subtitle">Evaluation Logs</span>
          <h1 className="page-title">Student Assessment Results</h1>
          <p className="text-muted">
            Review detailed attempt submissions, filter by specific tests, and inspect question answer keys.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="content-card mb-6">
        <div className="filter-toolbar-grid">
          {/* Quiz Filter Dropdown */}
          <div className="filter-group">
            <label><b>Filter by Quiz:</b></label>
            <select
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              className="filter-select"
            >
              <option value="">All Quizzes</option>
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
          </div>

          {/* Student Search Box */}
          <div className="filter-group">
            <label><b>Search Student:</b></label>
            <div className="search-bar-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="content-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Attempt #</th>
                <th>Student</th>
                <th>Quiz Title</th>
                <th>Category</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Submission Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const dateStr = r.attemptedAt
                  ? new Date(r.attemptedAt).toLocaleString()
                  : 'Recent';

                return (
                  <tr key={r.id}>
                    <td>
                      <span className="font-mono text-muted text-xs">#{r.attemptId || r.id}</span>
                    </td>
                    <td>
                      <div className="student-cell">
                        <span className="font-semibold">{r.studentName}</span>
                        <span className="text-muted text-xs">{r.studentEmail}</span>
                      </div>
                    </td>
                    <td className="font-semibold">{r.quizTitle}</td>
                    <td>
                      <span className="badge badge-light">{r.category}</span>
                    </td>
                    <td>
                      <b>{r.score}</b> / {r.totalMarks}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          r.percentage >= 75
                            ? 'badge-success'
                            : r.percentage >= 50
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {r.percentage}%
                      </span>
                    </td>
                    <td className="text-muted text-xs">{dateStr}</td>
                    <td>
                      <Link
                        to={`/quiz/result/${r.attemptId || r.id}`}
                        className="btn btn-outline-primary btn-xs flex-btn"
                      >
                        <span>Inspect Review</span>
                        <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {results.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-muted">
                    No results match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminResults;
