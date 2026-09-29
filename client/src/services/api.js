import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isAdminApiRequest = (url = '') =>
  url.includes('/admin') || url.includes('/tournaments/admin');

// Attach Admin JWT for organizer APIs; Firebase ID token for player APIs
api.interceptors.request.use(async (config) => {
  const url = config.url || '';

  if (isAdminApiRequest(url)) {
    const token = localStorage.getItem('ca_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  if (auth.currentUser) {
    const idToken = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${idToken}`;
  }

  return config;
});

// Response interceptor for session expiry handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('ca_admin_token');
        localStorage.removeItem('ca_admin_user');
        window.location.href = '/admin/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// --- TOURNAMENT API ---
export const getFeaturedTournament = () => api.get('/tournaments/featured');
export const getTournamentBySlug = (slug) => api.get(`/tournaments/slug/${slug}`);
export const getPreviousTournaments = () => api.get('/tournaments/previous');

// --- PLAYER AUTH API ---
export const syncAuthenticatedUser = () => api.post('/auth/sync');

// --- REGISTRATION & CHECKOUT API ---
export const createRegistrationOrder = (data) => api.post('/registrations/order', data);
export const verifyPaymentAndConfirm = (data) => api.post('/registrations/verify-payment', data);
export const lookupRegistration = (data) => api.post('/registrations/lookup', data);
export const getPublicRegisteredPlayers = (tournamentId = 'all') =>
  api.get(`/registrations/players/${tournamentId}`);

// --- ADMIN API ---
export const adminLogin = (credentials) => api.post('/admin/login', credentials);
export const getAdminMe = () => api.get('/admin/me');
export const getDashboardStats = (tournamentId) =>
  api.get('/admin/stats', { params: { tournamentId } });
export const getAdminRegistrations = (params) => api.get('/admin/registrations', { params });
export const manualVerifyPlayer = (data) => api.post('/admin/verify-player', data);
export const updateClubAccessStatus = (id, data) =>
  api.patch(`/admin/registrations/${id}/club-status`, data);
export const rejectOrRefundRegistration = (id, data) =>
  api.post(`/admin/registrations/${id}/action`, data);
export const getAdminAuditLogs = () => api.get('/admin/audit-logs');

// Admin Tournament Management
export const adminGetAllTournaments = () => api.get('/tournaments/admin/all');
export const adminCreateTournament = (data) => api.post('/tournaments/admin', data);
export const adminUpdateTournament = (id, data) => api.put(`/tournaments/admin/${id}`, data);
export const adminPublishResults = (id, data) => api.post(`/tournaments/admin/${id}/results`, data);
