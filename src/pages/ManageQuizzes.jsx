import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import quizService from '../services/quizService';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Search,
  CheckCircle,
  XCircle,
  Clock,
} from '../components/Icons';

export const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Form state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Java',
    difficulty: 'Easy',
    durationMinutes: 10,
    published: true,
  });

  // Delete modal state
  const [quizToDelete, setQuizToDelete] = useState(null);

  const loadQuizzes = async () => {
    try {
      const [qData, cData] = await Promise.all([
        quizService.getAllQuizzesAdmin(),
        quizService.getCategories().catch(() => []),
      ]);
      setQuizzes(qData);
      setCategories(cData);
    } catch (err) {
      setMsg({ type: 'danger', text: 'Failed to load quizzes.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleOpenCreate = () => {
    setEditingQuiz(null);
    setFormData({
      title: '',
      description: '',
      category: categories[0]?.name || 'Java',
      difficulty: 'Easy',
      durationMinutes: 10,
      published: true,
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title || '',
      description: quiz.description || '',
      category: quiz.category || 'Java',
      difficulty: quiz.difficulty || 'Easy',
      durationMinutes: quiz.durationMinutes || 10,
      published: quiz.published !== undefined ? quiz.published : true,
    });
    setShowFormModal(true);
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Quiz title is required.');
      return;
    }

    try {
      if (editingQuiz) {
        await quizService.updateQuiz(editingQuiz.id, formData);
        setMsg({ type: 'success', text: `Quiz "${formData.title}" updated successfully.` });
      } else {
        await quizService.createQuiz(formData);
        setMsg({ type: 'success', text: `Quiz "${formData.title}" created successfully.` });
      }
      setShowFormModal(false);
      await loadQuizzes();
    } catch (err) {
      setMsg({ type: 'danger', text: 'Error saving quiz: ' + (err.response?.data?.message || err.message) });
    }
  };

  const handleTogglePublish = async (quiz) => {
    try {
      const newStatus = !quiz.published;
      await quizService.togglePublish(quiz.id, newStatus);
      setMsg({
        type: 'success',
        text: `Quiz "${quiz.title}" is now ${newStatus ? 'Published' : 'Unpublished'}.`,
      });
      await loadQuizzes();
    } catch (err) {
      setMsg({ type: 'danger', text: 'Could not change publish status.' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return;
    try {
      await quizService.deleteQuiz(quizToDelete.id);
      setMsg({ type: 'success', text: `Quiz "${quizToDelete.title}" deleted successfully.` });
      setQuizToDelete(null);
      await loadQuizzes();
    } catch (err) {
      setMsg({ type: 'danger', text: 'Error deleting quiz.' });
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading quizzes catalog..." />;
  }

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title?.toLowerCase().includes(search.toLowerCase()) ||
      q.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section-container py-8">
      {/* Header */}
      <div className="card-header-flex mb-6">
        <div>
          <span className="section-subtitle">Admin Operations</span>
          <h1 className="page-title">Manage Quizzes</h1>
          <p className="text-muted">Create, edit, delete, and configure availability for all assessments.</p>
        </div>
        <button type="button" className="btn btn-primary flex-btn" onClick={handleOpenCreate}>
          <Plus size={18} />
          <span>Create New Quiz</span>
        </button>
      </div>

      {msg.text && (
        <div className={`alert alert-${msg.type} flex-alert mb-6`}>
          {msg.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="content-card mb-6">
        <div className="search-bar-wrap max-w-md">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search quizzes by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Quizzes Table */}
      <div className="content-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Questions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td>
                    <div className="quiz-title-cell">
                      <span className="font-semibold">{quiz.title}</span>
                      <span className="text-muted text-xs truncate max-w-xs">{quiz.description}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-light">{quiz.category}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        quiz.difficulty === 'Easy'
                          ? 'badge-success'
                          : quiz.difficulty === 'Medium'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {quiz.difficulty}
                    </span>
                  </td>
                  <td>
                    <span className="flex-btn text-muted">
                      <Clock size={14} /> {quiz.durationMinutes} min
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/admin/questions?quizId=${quiz.id}`}
                      className="badge badge-indigo flex-btn"
                      title="Manage Questions"
                    >
                      <BookOpen size={12} /> {quiz.questionCount || 0} Questions
                    </Link>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`status-toggle-btn ${quiz.published ? 'published' : 'unpublished'}`}
                      onClick={() => handleTogglePublish(quiz)}
                      title="Click to toggle publish status"
                    >
                      {quiz.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons-row">
                      <Link
                        to={`/admin/questions?quizId=${quiz.id}`}
                        className="btn btn-ghost btn-xs text-indigo"
                        title="Manage Questions"
                      >
                        <BookOpen size={16} />
                      </Link>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-primary"
                        onClick={() => handleOpenEdit(quiz)}
                        title="Edit Quiz"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-danger"
                        onClick={() => setQuizToDelete(quiz)}
                        title="Delete Quiz"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Quiz Modal */}
      {showFormModal && (
        <div className="modal-backdrop" onClick={() => setShowFormModal(false)}>
          <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingQuiz ? 'Edit Quiz' : 'Create New Assessment'}</h3>
            </div>
            <form onSubmit={handleSaveQuiz} className="modal-form-body">
              <div className="form-group">
                <label>Quiz Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Java Concepts"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of assessment topics and syllabus..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Category / Language *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Java, Python, Web Development"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="form-input"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration (Minutes) *</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    required
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  />
                  <span>Published (Available for students to take)</span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowFormModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(quizToDelete)}
        title="Delete Quiz?"
        message={`Are you sure you want to delete "${quizToDelete?.title}"? All associated questions will also be removed.`}
        confirmText="Yes, Delete Quiz"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setQuizToDelete(null)}
      />
    </div>
  );
};

export default ManageQuizzes;
