import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Play } from './Icons';

export const QuizCard = ({ quiz, onStart }) => {
  const navigate = useNavigate();

  const getDifficultyClass = (diff) => {
    switch ((diff || '').toLowerCase()) {
      case 'easy':
        return 'badge-easy';
      case 'medium':
        return 'badge-medium';
      case 'hard':
        return 'badge-hard';
      default:
        return 'badge-easy';
    }
  };

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <span className="quiz-category-tag">{quiz.category || 'General'}</span>
        <span className={`difficulty-badge ${getDifficultyClass(quiz.difficulty)}`}>
          {quiz.difficulty || 'Easy'}
        </span>
      </div>

      <h3 className="quiz-card-title">{quiz.title}</h3>
      <p className="quiz-card-desc">
        {quiz.description || 'Test your knowledge and skills with this assessment.'}
      </p>

      <div className="quiz-card-meta">
        <div className="meta-item">
          <Clock size={16} />
          <span>{quiz.durationMinutes || 10} mins</span>
        </div>
        <div className="meta-item">
          <BookOpen size={16} />
          <span>{quiz.questionCount || 5} questions</span>
        </div>
      </div>

      <div className="quiz-card-actions">
        <Link to={`/quizzes/${quiz.id}`} className="btn btn-outline-primary btn-sm">
          Details
        </Link>
        <button
          type="button"
          className="btn btn-primary btn-sm flex-btn"
          onClick={() => {
            if (onStart) onStart(quiz);
            else navigate(`/quiz/take/${quiz.id}`);
          }}
        >
          <Play size={14} />
          <span>Start Quiz</span>
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
