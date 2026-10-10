import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Shield, Trophy } from './Icons';

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <div className="brand-icon">
              <Award size={20} />
            </div>
            <span className="brand-name">QuizMaster</span>
          </div>
          <p className="footer-desc">
            An advanced, full-stack Online Quiz Management & Assessment Platform engineered with React, Spring Boot, MySQL, and JWT Security.
          </p>
          <div className="footer-badges">
            <span className="tech-badge">React 18</span>
            <span className="tech-badge">Spring Boot 3</span>
            <span className="tech-badge">MySQL</span>
            <span className="tech-badge">Spring Security + JWT</span>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Explore Quizzes</Link></li>
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            <li><Link to="/login">Student Login</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/explore?category=Java">Java Programming</Link></li>
            <li><Link to="/explore?category=Python">Python Development</Link></li>
            <li><Link to="/explore?category=Web%20Development">Web Technologies</Link></li>
            <li><Link to="/explore?category=Database%20Management">Database & SQL</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Project Information</h4>
          <p className="footer-text-muted">
            College Major Project Demonstration. Designed and developed with enterprise-grade modular architecture.
          </p>
          <div className="project-demo-box">
            <b>Admin Credentials:</b>
            <div>admin@quiz.com / admin123</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} QuizMaster System. All rights reserved.</p>
        <div className="footer-bottom-links">
          <span>Responsive UI</span>
          <span>&bull;</span>
          <span>RESTful Architecture</span>
          <span>&bull;</span>
          <span>Role-Based Access Control</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
