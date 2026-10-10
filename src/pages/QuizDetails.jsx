import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import quizService from '../services/quizService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Clock,
  BookOpen,
  CheckCircle,
  Play,
  ChevronLeft,
  AlertCircle,
  Award,
} from '../components/Icons';

export const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getQuizById(id);
        setQuiz(data);
      } catch (err) {
        setError('Quiz not found or currently unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading quiz details..." />;
  }

  if (error || !quiz) {
    return (
      <div className="section-container py-12 text-center">
        <AlertCircle size={48} className="text-danger mb-3" />
        <h2>Quiz Not Found</h2>
        <p className="text-muted">{error || 'The requested quiz does not exist.'}</p>
        <Link to="/explore" className="btn btn-primary mt-4">
          Back to Explore
        </Link>
      </div>
    );
  }

  const handleStart = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/quiz/take/${quiz.id}` } } });
    } else {
      navigate(`/quiz/take/${quiz.id}`);
    }
  };

  return (
    <div className="section-container py-10">
      <Link to="/explore" className="back-link mb-6">
        <ChevronLeft size={16} />
        <span>Back to Explore Quizzes</span>
      </Link>

      <div className="quiz-details-card">
        <div className="details-header">
          <div className="details-badges">
            <span className="quiz-category-tag">{quiz.category}</span>
            <span className="difficulty-badge badge-medium">{quiz.difficulty}</span>
          </div>
          <h1 className="details-title">{quiz.title}</h1>
          <p className="details-desc">{quiz.description}</p>
        </div>

        {/* Quick Specs Grid */}
        <div className="details-specs-grid">
          <div className="spec-box">
            <Clock size={24} className="spec-icon" />
            <div>
              <span className="spec-label">Time Limit</span>
              <span className="spec-val">{quiz.durationMinutes || 10} Minutes</span>
            </div>
          </div>

          <div className="spec-box">
            <BookOpen size={24} className="spec-icon" />
            <div>
              <span className="spec-label">Total Questions</span>
              <span className="spec-val">{quiz.questionCount || 5} Questions</span>
            </div>
          </div>

          <div className="spec-box">
            <Award size={24} className="spec-icon" />
            <div>
              <span className="spec-label">Total Marks</span>
              <span className="spec-val">{(quiz.questionCount || 5) * 1} Marks</span>
            </div>
          </div>

          <div className="spec-box">
            <CheckCircle size={24} className="spec-icon" />
            <div>
              <span className="spec-label">Passing Benchmark</span>
              <span className="spec-val">50% Minimum</span>
            </div>
          </div>
        </div>

        {/* Assessment Instructions & Guidelines */}
        <div className="details-rules-section">
          <h3>Assessment Guidelines & Rules</h3>
          <ul className="rules-list">
            <li>
              <b>Single Question View:</b> Questions are presented one at a time with instant previous/next navigation.
            </li>
            <li>
              <b>Question Palette:</b> You can jump to any question using the numeric question palette on the right.
            </li>
            <li>
              <b>Editable Choices:</b> You can freely change your selected option at any time before clicking submit.
            </li>
            <li>
              <b>Countdown Timer:</b> The timer will tick down in the top bar. When it reaches 00:00, your answers will automatically be submitted.
            </li>
            <li>
              <b>Backend Scoring:</b> Correct answers are never sent to your browser beforehand. Your score will be evaluated strictly on the secure Spring Boot server.
            </li>
          </ul>
        </div>

        <div className="details-action-bar">
          <button
            type="button"
            className="btn btn-primary btn-lg flex-btn"
            onClick={handleStart}
          >
            <Play size={20} />
            <span>{user ? 'Start Assessment Now' : 'Sign in to Start Quiz'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;
