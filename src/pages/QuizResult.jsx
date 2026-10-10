import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import resultService from '../services/resultService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  ChevronRight,
  Sparkles,
  Trophy,
} from '../components/Icons';

export const QuizResult = () => {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!result) {
      const fetchResult = async () => {
        try {
          const data = await resultService.getAttemptResult(attemptId);
          setResult(data);
        } catch (err) {
          setError('Unable to load quiz result.');
        } finally {
          setLoading(false);
        }
      };
      fetchResult();
    }
  }, [attemptId, result]);

  if (loading) {
    return <LoadingSpinner text="Evaluating and compiling result..." fullScreen />;
  }

  if (error || !result) {
    return (
      <div className="section-container py-12 text-center">
        <h2>Result Not Found</h2>
        <p className="text-muted">{error || 'Could not retrieve this attempt.'}</p>
        <Link to="/history" className="btn btn-primary mt-4">
          View My History
        </Link>
      </div>
    );
  }

  const isPassed = (result.percentage || 0) >= 50;

  return (
    <div className="section-container py-10">
      {/* Result Hero Score Card */}
      <div className="result-score-card">
        <div className="result-icon-badge">
          {isPassed ? <Trophy size={48} className="trophy-gold" /> : <Award size={48} className="trophy-silver" />}
        </div>

        <span className="result-status-tag">{isPassed ? 'Assessment Passed' : 'Assessment Completed'}</span>

        <h1 className="result-quiz-title">{result.quizTitle}</h1>
        <p className="result-feedback-text">{result.feedback}</p>

        {/* Big Score Display */}
        <div className="score-hero-display">
          <div className="score-number">
            <span className="score-obtained">{result.score}</span>
            <span className="score-divider">/</span>
            <span className="score-total">{result.totalMarks}</span>
          </div>
          <div className="score-percent-badge">{result.percentage}%</div>
        </div>

        {/* Breakdown Stat Pills */}
        <div className="result-metrics-row">
          <div className="metric-pill metric-correct">
            <CheckCircle size={18} />
            <span>Correct: <b>{result.correctCount || 0}</b></span>
          </div>
          <div className="metric-pill metric-incorrect">
            <XCircle size={18} />
            <span>Incorrect: <b>{result.incorrectCount || 0}</b></span>
          </div>
          <div className="metric-pill metric-unanswered">
            <Clock size={18} />
            <span>Unanswered: <b>{result.unattemptedCount || 0}</b></span>
          </div>
        </div>

        {/* Actions Button Row */}
        <div className="result-actions-row">
          <Link to="/dashboard" className="btn btn-primary flex-btn">
            <span>Student Dashboard</span>
            <ChevronRight size={16} />
          </Link>
          <Link to="/history" className="btn btn-outline-primary flex-btn">
            <span>Quiz History</span>
          </Link>
          <Link to="/explore" className="btn btn-secondary flex-btn">
            <BookOpen size={16} />
            <span>Explore More Quizzes</span>
          </Link>
        </div>
      </div>

      {/* Question-Level Detailed Review */}
      <div className="review-section mt-10">
        <div className="section-header mb-6">
          <div>
            <span className="section-subtitle">Answer Key & Explanations</span>
            <h2 className="section-title">Question-by-Question Review</h2>
          </div>
        </div>

        <div className="review-list">
          {result.answersReview && result.answersReview.map((item, index) => {
            const isCorrect = item.isCorrect;
            const isAnswered = Boolean(item.selectedAnswer);

            return (
              <div
                key={item.questionId || index}
                className={`review-card ${isCorrect ? 'review-correct' : isAnswered ? 'review-incorrect' : 'review-unattempted'}`}
              >
                <div className="review-card-header">
                  <span className="review-q-num">Question {index + 1}</span>
                  <div className="review-status-indicator">
                    {isCorrect ? (
                      <span className="badge badge-success flex-btn">
                        <CheckCircle size={14} /> Correct (+{item.marksObtained} Marks)
                      </span>
                    ) : isAnswered ? (
                      <span className="badge badge-danger flex-btn">
                        <XCircle size={14} /> Incorrect (0 Marks)
                      </span>
                    ) : (
                      <span className="badge badge-warning flex-btn">
                        <Clock size={14} /> Not Answered
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="review-q-text">{item.question}</h3>

                {/* Options list with highlight */}
                <div className="review-options-grid">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    const optText = item[`option${opt}`];
                    const isStudentChoice = item.selectedAnswer === opt;
                    const isCorrectAnswer = item.correctAnswer === opt;

                    let optClass = 'review-option';
                    if (isCorrectAnswer) optClass += ' opt-correct-key';
                    if (isStudentChoice && !isCorrectAnswer) optClass += ' opt-student-wrong';

                    return (
                      <div key={opt} className={optClass}>
                        <div className="opt-marker">{opt}</div>
                        <div className="opt-body">
                          <span>{optText}</span>
                          {isCorrectAnswer && <span className="opt-tag tag-correct">Correct Answer</span>}
                          {isStudentChoice && !isCorrectAnswer && (
                            <span className="opt-tag tag-wrong">Your Answer</span>
                          )}
                          {isStudentChoice && isCorrectAnswer && (
                            <span className="opt-tag tag-correct">Your Answer</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
