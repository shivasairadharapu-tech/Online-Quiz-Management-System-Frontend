import api from './api';

export const resultService = {
  // Student Results & Analytics
  getAttemptResult: async (attemptId) => {
    const response = await api.get(`/results/${attemptId}`);
    return response.data;
  },

  getMyAnalytics: async () => {
    const response = await api.get('/results/user/me');
    return response.data;
  },

  getMyHistory: async () => {
    const response = await api.get('/results/user/me/history');
    return response.data;
  },

  // Leaderboard
  getLeaderboard: async () => {
    const response = await api.get('/leaderboard');
    return response.data;
  },

  // Admin Dashboard & Management
  getAdminDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAdminStudents: async (search = '') => {
    const response = await api.get('/admin/students', { params: { search } });
    return response.data;
  },

  getAdminResults: async (quizId = null, search = '') => {
    const response = await api.get('/admin/results', {
      params: { quizId: quizId || undefined, search: search || undefined },
    });
    return response.data;
  },
};

export default resultService;
