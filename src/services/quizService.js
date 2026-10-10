import api from './api';

export const quizService = {
  // Public & Student Endpoints
  getPublishedQuizzes: async (params = {}) => {
    const response = await api.get('/quizzes', { params });
    return response.data;
  },

  getQuizById: async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Attempt Lifecycle Endpoints
  startAttempt: async (quizId) => {
    const response = await api.post(`/attempts/start/${quizId}`);
    return response.data;
  },

  getAttempt: async (attemptId) => {
    const response = await api.get(`/attempts/${attemptId}`);
    return response.data;
  },

  submitAttempt: async (attemptId, answers) => {
    const response = await api.post(`/attempts/${attemptId}/submit`, { answers });
    return response.data;
  },

  // Admin Quizzes Endpoints
  getAllQuizzesAdmin: async () => {
    const response = await api.get('/admin/quizzes');
    return response.data;
  },

  createQuiz: async (quizData) => {
    const response = await api.post('/admin/quizzes', quizData);
    return response.data;
  },

  updateQuiz: async (id, quizData) => {
    const response = await api.put(`/admin/quizzes/${id}`, quizData);
    return response.data;
  },

  deleteQuiz: async (id) => {
    const response = await api.delete(`/admin/quizzes/${id}`);
    return response.data;
  },

  togglePublish: async (id, published) => {
    const response = await api.patch(`/admin/quizzes/${id}/publish`, { published });
    return response.data;
  },

  // Admin Questions Endpoints
  getQuizQuestionsAdmin: async (quizId) => {
    const response = await api.get(`/admin/quizzes/${quizId}/questions`);
    return response.data;
  },

  addQuestion: async (quizId, questionData) => {
    const response = await api.post(`/admin/quizzes/${quizId}/questions`, questionData);
    return response.data;
  },

  updateQuestion: async (id, questionData) => {
    const response = await api.put(`/admin/questions/${id}`, questionData);
    return response.data;
  },

  deleteQuestion: async (id) => {
    const response = await api.delete(`/admin/questions/${id}`);
    return response.data;
  },

  // Admin Categories
  createCategory: async (categoryData) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

export default quizService;
