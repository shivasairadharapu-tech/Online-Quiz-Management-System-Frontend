import React, { useEffect, useState } from 'react';
import resultService from '../services/resultService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Search, Award, CheckCircle } from '../components/Icons';

export const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await resultService.getAdminStudents(search);
        setStudents(data);
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [search]);

  if (loading) {
    return <LoadingSpinner text="Fetching student records..." />;
  }

  return (
    <div className="section-container py-8">
      <div className="card-header-flex mb-6">
        <div>
          <span className="section-subtitle">Student Directory</span>
          <h1 className="page-title">Registered Students</h1>
          <p className="text-muted">
            Monitor registered learner profiles, completed assessments count, and academic scores.
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="content-card mb-6">
        <div className="search-bar-wrap max-w-md">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearch('')}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="content-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Completed Quizzes</th>
                <th>Average Score</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <span className="text-muted font-mono">#{student.id}</span>
                  </td>
                  <td>
                    <div className="student-profile-cell">
                      <div className="avatar-small">
                        {student.name ? student.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="font-semibold">{student.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-sm">{student.email}</span>
                  </td>
                  <td>
                    <span className="badge badge-primary">{student.role}</span>
                  </td>
                  <td>
                    <span className="badge badge-light">
                      {student.totalAttempts || 0} Attempts
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        (student.averageScore || 0) >= 75
                          ? 'badge-success'
                          : (student.averageScore || 0) >= 50
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {student.averageScore || 0}%
                    </span>
                  </td>
                  <td className="text-muted text-xs">
                    {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'Active'}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted">
                    No students match the search criteria.
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

export default ManageStudents;
