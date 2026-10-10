import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import quizService from '../services/quizService';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from '../components/Icons';

export const ManageQuestions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuizId = searchParams.get('quizId');

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(urlQuizId || '');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Question Form Modal
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    marks: 1,
  });

  // Delete modal
  const [questionToDelete, setQuestionToDelete] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizService.getAllQuizzesAdmin();
        setQuizzes(data);
        if (data.length > 0 && !selectedQuizId) {
          setSelectedQuizId(data[0].id);
        }
      } catch (err) {
        setMsg({ type: 'danger', text: 'Failed to load quizzes.' });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuizId) {
      loadQuestions(selectedQuizId);
      setSearchParams({ quizId: selectedQuizId });
    }
  }, [selectedQuizId]);

  const loadQuestions = async (quizId) => {
    try {
      const data = await quizService.getQuizQuestionsAdmin(quizId);
      setQuestions(data);
    } catch (err) {
      setMsg({ type: 'danger', text: 'Error fetching questions for this quiz.' });
    }
  };

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setFormData({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      marks: 1,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setFormData({
      question: q.question || '',
      optionA: q.optionA || '',
      optionB: q.optionB || '',
      optionC: q.optionC || '',
      optionD: q.optionD || '',
      correctAnswer: q.correctAnswer || 'A',
      marks: q.marks || 1,
    });
    setShowModal(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.optionA.trim() || !formData.optionB.trim()) {
      alert('Please fill in question text and options.');
      return;
    }

    try {
      if (editingQuestion) {
        await quizService.updateQuestion(editingQuestion.id, formData);
        setMsg({ type: 'success', text: 'Question updated successfully.' });
      } else {
        await quizService.addQuestion(selectedQuizId, formData);
        setMsg({ type: 'success', text: 'New question added successfully.' });
      }
      setShowModal(false);
      await loadQuestions(selectedQuizId);
    } catch (err) {
      setMsg({ type: 'danger', text: 'Error saving question.' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;
    try {
      await quizService.deleteQuestion(questionToDelete.id);
      setMsg({ type: 'success', text: 'Question deleted.' });
      setQuestionToDelete(null);
      await loadQuestions(selectedQuizId);
    } catch (err) {
      setMsg({ type: 'danger', text: 'Failed to delete question.' });
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading question repository..." />;
  }

  const currentQuiz = quizzes.find((q) => String(q.id) === String(selectedQuizId));

  return (
    <div className="section-container py-8">
      {/* Header */}
      <div className="card-header-flex mb-6">
        <div>
          <span className="section-subtitle">Question Bank</span>
          <h1 className="page-title">Manage MCQ Questions</h1>
          <p className="text-muted">Select a quiz to review, add, edit, or remove multiple-choice questions.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary flex-btn"
          onClick={handleOpenCreate}
          disabled={!selectedQuizId}
        >
          <Plus size={18} />
          <span>Add Question</span>
        </button>
      </div>

      {msg.text && (
        <div className={`alert alert-${msg.type} flex-alert mb-6`}>
          {msg.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Quiz Selector Toolbar */}
      <div className="content-card mb-6">
        <div className="quiz-select-bar">
          <label htmlFor="quizSelect"><b>Select Quiz:</b></label>
          <select
            id="quizSelect"
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="filter-select select-lg"
          >
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title} ({q.category} &bull; {q.difficulty})
              </option>
            ))}
          </select>
          {currentQuiz && (
            <span className="text-muted text-sm ml-auto">
              Total Questions in Quiz: <b>{questions.length}</b>
            </span>
          )}
        </div>
      </div>

      {/* Question List */}
      <div className="questions-manage-list">
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div key={q.id} className="content-card question-item-card mb-4">
              <div className="q-item-header">
                <div className="q-badge-wrap">
                  <span className="badge badge-primary">Q{index + 1}</span>
                  <span className="text-muted text-xs">Marks: {q.marks || 1}</span>
                </div>
                <div className="q-actions-row">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs text-primary"
                    onClick={() => handleOpenEdit(q)}
                    title="Edit Question"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs text-danger"
                    onClick={() => setQuestionToDelete(q)}
                    title="Delete Question"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="q-text-body">{q.question}</h3>

              {/* Four Options Preview */}
              <div className="q-options-grid">
                {['A', 'B', 'C', 'D'].map((letter) => {
                  const isCorrect = q.correctAnswer === letter;
                  return (
                    <div
                      key={letter}
                      className={`q-opt-pill ${isCorrect ? 'opt-is-correct' : ''}`}
                    >
                      <b className="opt-letter">{letter}.</b>
                      <span>{q[`option${letter}`]}</span>
                      {isCorrect && <span className="badge badge-success opt-correct-badge">Correct Answer</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="content-card empty-state text-center py-8">
            <BookOpen size={40} className="text-muted mb-3" />
            <h3>No questions found for this quiz</h3>
            <p className="text-muted">Click "Add Question" above to add the first MCQ.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-3 flex-btn mx-auto"
              onClick={handleOpenCreate}
            >
              <Plus size={16} />
              <span>Add First Question</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingQuestion ? 'Edit Question' : 'Add Multiple-Choice Question'}</h3>
            </div>
            <form onSubmit={handleSaveQuestion} className="modal-form-body">
              <div className="form-group">
                <label>Question Text *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter the question statement clearly..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="options-input-grid">
                <div className="form-group">
                  <label>Option A *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionA}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Option B *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionB}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Option C *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionC}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Option D *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionD}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Correct Answer *</label>
                  <select
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    className="form-input select-correct"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Marks *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingQuestion ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Question Modal */}
      <ConfirmationModal
        isOpen={Boolean(questionToDelete)}
        title="Delete Question?"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Yes, Delete Question"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setQuestionToDelete(null)}
      />
    </div>
  );
};

export default ManageQuestions;
