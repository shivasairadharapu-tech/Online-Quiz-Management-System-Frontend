import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../services/quizService';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import ProgressBar from '../components/ProgressBar';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Award,
} from '../components/Icons';

export const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attemptData, setAttemptData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: "A" | "B" | "C" | "D" }
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const timerRef = useRef(null);

  // Initialize Quiz Attempt
  useEffect(() => {
    let isMounted = true;

    const startOrResumeQuiz = async () => {
      try {
        const data = await quizService.startAttempt(id);
        if (!isMounted) return;

        setAttemptData(data);
        setQuestions(data.questions || []);
        setSecondsRemaining(data.remainingSeconds || (data.durationMinutes || 10) * 60);
      } catch (err) {
        if (!isMounted) return;
        const msg = err.response?.data?.message || err.message || 'Unable to start quiz attempt.';
        setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    startOrResumeQuiz();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (!attemptData || isSubmitting) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attemptData, isSubmitting, answers]);

  // Handle Option Select
  const handleSelectOption = (questionId, optionLetter) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionLetter,
    }));
  };

  // Submit Logic
  const handleSubmit = async () => {
    if (!attemptData || isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const result = await quizService.submitAttempt(attemptData.attemptId, answers);
      navigate(`/quiz/result/${attemptData.attemptId}`, { replace: true, state: { result } });
    } catch (err) {
      alert('Error submitting quiz: ' + (err.response?.data?.message || err.message));
      setIsSubmitting(false);
    }
  };

  // Automatic submission when timer expires
  const handleAutoSubmit = async () => {
    if (!attemptData || isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const result = await quizService.submitAttempt(attemptData.attemptId, answers);
      navigate(`/quiz/result/${attemptData.attemptId}`, { replace: true, state: { result, autoSubmitted: true } });
    } catch (err) {
      console.error('Auto-submit failed:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing your assessment questions..." fullScreen />;
  }

  if (error || !questions.length) {
    return (
      <div className="section-container py-12 text-center">
        <AlertCircle size={48} className="text-danger mb-3" />
        <h2>Unable to Take Quiz</h2>
        <p className="text-muted">{error || 'This quiz has no questions available.'}</p>
        <button type="button" className="btn btn-primary mt-4" onClick={() => navigate('/explore')}>
          Back to Explore
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Format Timer mm:ss
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = secondsRemaining < 60;

  return (
    <div className="take-quiz-page">
      {/* Quiz Top Bar */}
      <header className="quiz-topbar">
        <div className="quiz-topbar-left">
          <span className="quiz-title-badge">{attemptData?.quizTitle}</span>
          <span className="quiz-category-pill">{attemptData?.category}</span>
        </div>

        {/* Countdown Timer */}
        <div className={`quiz-timer-badge ${isTimeCritical ? 'critical' : ''}`}>
          <Clock size={18} />
          <span>{formattedTime}</span>
        </div>

        <div className="quiz-topbar-right">
          <button
            type="button"
            className="btn btn-success btn-sm flex-btn"
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting}
          >
            <CheckCircle size={16} />
            <span>Finish & Submit</span>
          </button>
        </div>
      </header>

      {/* Progress Bar Across Top */}
      <ProgressBar current={currentIndex + 1} total={totalQuestions} height={5} />

      {/* Main Quiz Area */}
      <div className="quiz-body-container">
        {/* Left: Active Question Area */}
        <div className="quiz-main-panel">
          <div className="question-header">
            <div className="question-badge">
              Question {currentIndex + 1} of {totalQuestions}
            </div>
            <span className="question-marks">Marks: {currentQ.marks || 1}</span>
          </div>

          <h2 className="question-text">{currentQ.question}</h2>

          {/* Options Grid / List */}
          <div className="options-container">
            {['A', 'B', 'C', 'D'].map((letter) => {
              const optionText = currentQ[`option${letter}`];
              const isSelected = answers[currentQ.id] === letter;

              return (
                <div
                  key={letter}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(currentQ.id, letter)}
                >
                  <div className={`option-letter ${isSelected ? 'active' : ''}`}>{letter}</div>
                  <div className="option-text">{optionText}</div>
                </div>
              );
            })}
          </div>

          {/* Previous / Next Navigation Controls */}
          <div className="quiz-nav-controls">
            <button
              type="button"
              className="btn btn-secondary btn-sm flex-btn"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <div className="clear-selection-btn">
              {answers[currentQ.id] && (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-muted"
                  onClick={() => {
                    const copy = { ...answers };
                    delete copy[currentQ.id];
                    setAnswers(copy);
                  }}
                >
                  Clear Answer
                </button>
              )}
            </div>

            {currentIndex < totalQuestions - 1 ? (
              <button
                type="button"
                className="btn btn-primary btn-sm flex-btn"
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success btn-sm flex-btn"
                onClick={() => setShowConfirmModal(true)}
              >
                <CheckCircle size={16} />
                <span>Submit Quiz</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Palette / Navigator */}
        <aside className="quiz-palette-panel">
          <h3 className="palette-title">Question Navigator</h3>

          {/* Palette Status Legend */}
          <div className="palette-legend">
            <div className="legend-item">
              <span className="legend-color legend-current" />
              <span>Current</span>
            </div>
            <div className="legend-item">
              <span className="legend-color legend-answered" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="legend-item">
              <span className="legend-color legend-unanswered" />
              <span>Unanswered ({unansweredCount})</span>
            </div>
          </div>

          {/* Question Number Grid */}
          <div className="palette-grid">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(answers[q.id]);
              const isCurrent = idx === currentIndex;

              let btnClass = 'palette-btn';
              if (isCurrent) btnClass += ' current';
              else if (isAnswered) btnClass += ' answered';
              else btnClass += ' unanswered';

              return (
                <button
                  key={q.id}
                  type="button"
                  className={btnClass}
                  onClick={() => setCurrentIndex(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="palette-summary">
            <div className="summary-row">
              <span>Total Questions:</span>
              <b>{totalQuestions}</b>
            </div>
            <div className="summary-row">
              <span>Answered:</span>
              <b className="text-success">{answeredCount}</b>
            </div>
            <div className="summary-row">
              <span>Remaining:</span>
              <b className="text-warning">{unansweredCount}</b>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-success btn-block mt-4 flex-btn"
            onClick={() => setShowConfirmModal(true)}
          >
            <CheckCircle size={16} />
            <span>Review & Submit</span>
          </button>
        </aside>
      </div>

      {/* Submit Confirmation Dialog Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Ready to Submit Quiz?"
        message={`You have answered ${answeredCount} of ${totalQuestions} questions (${unansweredCount} unanswered). Once submitted, answers cannot be modified.`}
        confirmText={isSubmitting ? 'Submitting...' : 'Yes, Submit Assessment'}
        cancelText="Return to Questions"
        confirmVariant="primary"
        onConfirm={handleSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

export default TakeQuiz;
