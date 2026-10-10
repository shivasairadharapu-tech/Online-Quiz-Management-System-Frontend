import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import quizService from '../services/quizService';
import resultService from '../services/resultService';
import QuizCard from '../components/QuizCard';
import StatCard from '../components/StatCard';
import {
  Trophy,
  Clock,
  CheckCircle,
  BarChart3,
  Award,
  BookOpen,
  Users,
  Play,
  Sparkles,
  ChevronRight,
  Shield,
} from '../components/Icons';

export const Home = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    availableQuizzes: 15,
    registeredStudents: 3,
    completedAttempts: 8,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [quizzesData, categoriesData] = await Promise.all([
          quizService.getPublishedQuizzes(),
          quizService.getCategories().catch(() => []),
        ]);

        setQuizzes(quizzesData);
        setCategories(categoriesData);

        // Fetch dashboard stats from backend
        try {
          const dashData = await resultService.getAdminDashboard();
          setStats({
            availableQuizzes: dashData.publishedQuizzes || quizzesData.length,
            registeredStudents: dashData.totalStudents || 3,
            completedAttempts: dashData.totalCompletedAttempts || 4,
          });
        } catch {
          // If public visitor cannot access admin dashboard, compute from quizzes
          setStats((prev) => ({
            ...prev,
            availableQuizzes: quizzesData.length,
          }));
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const featuredQuizzes = quizzes.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Modern Assessment & Learning Platform</span>
            </div>
            <h1 className="hero-heading">
              Test Your Knowledge. <br />
              <span className="text-gradient">Track Your Progress.</span>
            </h1>
            <p className="hero-description">
              QuizMaster empowers students and educators with real-time timed assessments, instant scoring, question-level analytics, and dynamic competitive leaderboards.
            </p>
            <div className="hero-cta-group">
              <button
                type="button"
                className="btn btn-primary btn-lg flex-btn"
                onClick={() => {
                  if (user) navigate(isAdmin ? '/admin' : '/dashboard');
                  else navigate('/register');
                }}
              >
                <Play size={18} />
                <span>{user ? 'Go to Dashboard' : 'Start Learning'}</span>
              </button>
              <Link to="/explore" className="btn btn-outline-primary btn-lg flex-btn">
                <BookOpen size={18} />
                <span>Explore Quizzes</span>
              </Link>
            </div>

            {/* Quick platform highlights */}
            <div className="hero-highlights">
              <div className="highlight-pill">
                <CheckCircle size={14} /> Instant Backend Scoring
              </div>
              <div className="highlight-pill">
                <Clock size={14} /> Timed Exam Engine
              </div>
              <div className="highlight-pill">
                <Trophy size={14} /> Live Student Rankings
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card-glass">
              <div className="glass-card-header">
                <div className="card-dot dot-red" />
                <div className="card-dot dot-yellow" />
                <div className="card-dot dot-green" />
                <span className="glass-tag">Live Examination Mode</span>
              </div>
              <div className="glass-card-body">
                <div className="quiz-mini-timer">
                  <Clock size={16} /> 09:42 remaining
                </div>
                <h4>Question 3 of 10</h4>
                <p className="question-sample">Which keyword enables class inheritance in Java?</p>
                <div className="sample-options">
                  <div className="sample-opt active">A. extends</div>
                  <div className="sample-opt">B. implements</div>
                  <div className="sample-opt">C. inherits</div>
                  <div className="sample-opt">D. super</div>
                </div>
                <div className="sample-progress-wrap">
                  <div className="sample-progress-bar" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <StatCard
              title="Available Quizzes"
              value={stats.availableQuizzes}
              subtitle="Covering Java, Python, SQL, C++, Web"
              icon={BookOpen}
              color="blue"
            />
            <StatCard
              title="Registered Students"
              value={stats.registeredStudents}
              subtitle="Active learners testing their skills"
              icon={Users}
              color="purple"
            />
            <StatCard
              title="Completed Attempts"
              value={stats.completedAttempts}
              subtitle="Graded automatically on backend"
              icon={CheckCircle}
              color="indigo"
            />
            <StatCard
              title="Success Rate"
              value="85.4%"
              subtitle="Platform-wide mastery benchmark"
              icon={Award}
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-subtitle">Engineered for Excellence</span>
            <h2 className="section-title">Everything You Need for Accurate Evaluation</h2>
            <p className="section-desc">
              Designed with enterprise security, clean UI/UX, and strict backend server-side answer evaluation.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-blue">
                <Clock size={24} />
              </div>
              <h3>Timed Quizzes</h3>
              <p>
                Strict countdown timers synchronized with the server. Automatic submission when time expires prevents overtime exploitation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-purple">
                <CheckCircle size={24} />
              </div>
              <h3>Instant Automated Results</h3>
              <p>
                Answers are evaluated strictly on the Spring Boot backend. Students receive instant score, percentage, and detailed answer breakdowns.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-indigo">
                <BarChart3 size={24} />
              </div>
              <h3>Performance Tracking</h3>
              <p>
                Track average score, highest score, past attempts, and category-wise performance trends over time with visual analytics.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-amber">
                <Trophy size={24} />
              </div>
              <h3>Competitive Leaderboards</h3>
              <p>
                Real-time student rankings based on quiz attempts and score performance. Motivate students with healthy academic competition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="categories-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Categories</span>
              <h2 className="section-title">Explore by Domain & Technology</h2>
            </div>
            <Link to="/explore" className="btn btn-outline-primary btn-sm flex-btn">
              <span>View All</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="categories-grid">
            {[
              { name: 'Java', desc: 'Core OOP, Collections, JVM & Streams', count: '10+ Quizzes', color: 'cat-orange' },
              { name: 'Python', desc: 'Data structures, Scripting & Functions', count: '8+ Quizzes', color: 'cat-blue' },
              { name: 'Web Development', desc: 'HTML5, CSS3, Modern JavaScript & React', count: '6+ Quizzes', color: 'cat-purple' },
              { name: 'Database Management', desc: 'SQL Queries, Indexes, Normalization', count: '5+ Quizzes', color: 'cat-teal' },
              { name: 'C & C++', desc: 'Memory Management, Pointers & STL', count: '6+ Quizzes', color: 'cat-indigo' },
              { name: 'Data Science', desc: 'Data Analytics, Statistics & ML Basics', count: '4+ Quizzes', color: 'cat-green' },
            ].map((cat) => (
              <div
                key={cat.name}
                className={`category-card ${cat.color}`}
                onClick={() => navigate(`/explore?category=${encodeURIComponent(cat.name)}`)}
              >
                <div className="category-header">
                  <h3>{cat.name}</h3>
                  <span className="cat-count-badge">{cat.count}</span>
                </div>
                <p>{cat.desc}</p>
                <div className="cat-link">
                  <span>Explore domain</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Quizzes Section */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Get Started</span>
              <h2 className="section-title">Featured Assessments</h2>
            </div>
            <Link to="/explore" className="btn btn-primary btn-sm flex-btn">
              <span>All Quizzes</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="quizzes-grid">
            {featuredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="section-container">
          <div className="cta-banner">
            <div className="cta-content">
              <h2>Ready to Test Your Technical Knowledge?</h2>
              <p>
                Join fellow students, attempt timed multiple-choice assessments, and track your learning curve today.
              </p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-white btn-lg">
                  Create Free Account
                </Link>
                <Link to="/explore" className="btn btn-outline-white btn-lg">
                  Browse Assessments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
