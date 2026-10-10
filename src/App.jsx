import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ExploreQuizzes from './pages/ExploreQuizzes';
import QuizDetails from './pages/QuizDetails';
import Leaderboard from './pages/Leaderboard';
import QuizResult from './pages/QuizResult';
import TakeQuiz from './pages/TakeQuiz';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import QuizHistory from './pages/QuizHistory';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageQuizzes from './pages/ManageQuizzes';
import ManageQuestions from './pages/ManageQuestions';
import ManageStudents from './pages/ManageStudents';
import AdminResults from './pages/AdminResults';

export const App = () => {
  return (
    <Routes>
      {/* Standalone Quiz Taking Screen (Distraction-free exam mode) */}
      <Route path="/quiz/take/:id" element={<TakeQuiz />} />

      {/* Public Pages with Main Navbar + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExploreQuizzes />} />
        <Route path="/quizzes/:id" element={<QuizDetails />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/quiz/result/:attemptId" element={<QuizResult />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Student Portal Protected Routes */}
      <Route element={<DashboardLayout requiredRole="STUDENT" />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/history" element={<QuizHistory />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Portal Protected Routes */}
      <Route element={<DashboardLayout requiredRole="ADMIN" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/quizzes" element={<ManageQuizzes />} />
        <Route path="/admin/questions" element={<ManageQuestions />} />
        <Route path="/admin/students" element={<ManageStudents />} />
        <Route path="/admin/results" element={<AdminResults />} />
        <Route path="/admin/analytics" element={<AdminDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
