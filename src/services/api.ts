import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  logout: () => api.post('/auth/logout'),
  
  getMe: () => api.get('/auth/me'),
  
  refreshToken: () => api.post('/auth/refresh'),
};

// Quiz API
export const quizAPI = {
  getAll: (params?: { specialty?: string; difficulty?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/quizzes', { params }),
  
  getById: (id: string) => api.get(`/quizzes/${id}`),
  
  create: (quizData: any) => api.post('/quizzes', quizData),
  
  update: (id: string, quizData: any) => api.put(`/quizzes/${id}`, quizData),
  
  delete: (id: string) => api.delete(`/quizzes/${id}`),
  
  submit: (id: string, answers: any) => api.post(`/quizzes/${id}/submit`, answers),
  
  getResults: (id: string) => api.get(`/quizzes/${id}/results`),
  
  getUserHistory: (params?: { page?: number; limit?: number }) =>
    api.get('/quizzes/user/history', { params }),
};

// Module API
export const moduleAPI = {
  getAll: (params?: { specialty?: string; difficulty?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/modules', { params }),
  
  getById: (id: string) => api.get(`/modules/${id}`),
  
  create: (moduleData: any) => api.post('/modules', moduleData),
  
  update: (id: string, moduleData: any) => api.put(`/modules/${id}`, moduleData),
  
  delete: (id: string) => api.delete(`/modules/${id}`),
  
  complete: (id: string) => api.post(`/modules/${id}/complete`),
  
  getUserProgress: () => api.get('/modules/user/progress'),
};

// Case Study API
export const caseStudyAPI = {
  getAll: (params?: { specialty?: string; difficulty?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/case-studies', { params }),
  
  getById: (id: string) => api.get(`/case-studies/${id}`),
  
  create: (caseData: any) => api.post('/case-studies', caseData),
  
  update: (id: string, caseData: any) => api.put(`/case-studies/${id}`, caseData),
  
  delete: (id: string) => api.delete(`/case-studies/${id}`),
  
  submit: (id: string, responses: any) => api.post(`/case-studies/${id}/submit`, responses),
  
  getResults: (id: string) => api.get(`/case-studies/${id}/results`),
};

// Session API
export const sessionAPI = {
  getAll: (params?: { type?: string; page?: number; limit?: number }) =>
    api.get('/sessions', { params }),
  
  getByRoomId: (roomId: string) => api.get(`/sessions/room/${roomId}`),
  
  create: (sessionData: any) => api.post('/sessions', sessionData),
  
  join: (roomId: string) => api.post(`/sessions/${roomId}/join`),
  
  leave: (roomId: string) => api.post(`/sessions/${roomId}/leave`),
  
  end: (roomId: string) => api.post(`/sessions/${roomId}/end`),
  
  updateScore: (roomId: string, score: number) => api.post(`/sessions/${roomId}/score`, { score }),
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobal: (params?: { timeframe?: string; limit?: number }) =>
    api.get('/leaderboard', { params }),
  
  getQuizLeaderboard: (quizId: string, params?: { limit?: number }) =>
    api.get(`/leaderboard/quiz/${quizId}`, { params }),
  
  getUserRank: () => api.get('/leaderboard/user/rank'),
  
  getStats: () => api.get('/leaderboard/stats'),
};

// Upload API
export const uploadAPI = {
  uploadDocument: (formData: FormData) =>
    api.post('/uploads/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  getDocuments: (params?: { search?: string; specialty?: string; page?: number; limit?: number }) =>
    api.get('/uploads/documents', { params }),
  
  deleteDocument: (id: string) => api.delete(`/uploads/documents/${id}`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  
  updatePreferences: (preferences: any) => api.put('/users/preferences', preferences),
  
  getStats: () => api.get('/users/stats'),
  
  addXP: (amount: number) => api.post('/users/xp', { amount }),
  
  addBadge: (badge: any) => api.post('/users/badges', badge),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;