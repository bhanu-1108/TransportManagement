/**
 * TransitOps API Service Layer
 * Fully connected to the Node.js + Express backend service.
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('transitops_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('transitops_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// ===== AUTH API =====
export const authAPI = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  logout: async () => {
    return api.post('/auth/logout');
  },
};

// ===== DASHBOARD API =====
export const dashboardAPI = {
  getKPIs: async (filters = {}) => {
    return api.get('/dashboard/kpis', { params: filters });
  },

  getRecentTrips: async () => {
    return api.get('/dashboard/recent-trips');
  },
};

// ===== VEHICLES API =====
export const vehiclesAPI = {
  getAll: async (filters = {}) => {
    return api.get('/vehicles', { params: filters });
  },

  getById: async (id) => {
    return api.get(`/vehicles/${id}`);
  },

  create: async (data) => {
    return api.post('/vehicles', data);
  },

  update: async (id, data) => {
    return api.put(`/vehicles/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/vehicles/${id}`);
  },
};

// ===== DRIVERS API =====
export const driversAPI = {
  getAll: async (filters = {}) => {
    return api.get('/drivers', { params: filters });
  },

  getById: async (id) => {
    return api.get(`/drivers/${id}`);
  },

  create: async (data) => {
    return api.post('/drivers', data);
  },

  update: async (id, data) => {
    return api.put(`/drivers/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/drivers/${id}`);
  },
};

// ===== TRIPS API =====
export const tripsAPI = {
  getAll: async (filters = {}) => {
    return api.get('/trips', { params: filters });
  },

  getById: async (id) => {
    return api.get(`/trips/${id}`);
  },

  create: async (data) => {
    return api.post('/trips', data);
  },

  update: async (id, data) => {
    return api.put(`/trips/${id}`, data);
  },

  updateStatus: async (id, status) => {
    return api.patch(`/trips/${id}/status`, { status });
  },

  delete: async (id) => {
    return api.delete(`/trips/${id}`);
  },
};

// ===== MAINTENANCE API =====
export const maintenanceAPI = {
  getAll: async (filters = {}) => {
    return api.get('/maintenance', { params: filters });
  },

  getById: async (id) => {
    return api.get(`/maintenance/${id}`);
  },

  create: async (data) => {
    return api.post('/maintenance', data);
  },

  update: async (id, data) => {
    return api.put(`/maintenance/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/maintenance/${id}`);
  },
};

// ===== FUEL API =====
export const fuelAPI = {
  getAll: async (filters = {}) => {
    return api.get('/fuel', { params: filters });
  },

  create: async (data) => {
    return api.post('/fuel', data);
  },

  update: async (id, data) => {
    return api.put(`/fuel/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/fuel/${id}`);
  },

  getCostData: async () => {
    return api.get('/fuel/cost-data');
  },
};

// ===== EXPENSES API =====
export const expensesAPI = {
  getAll: async (filters = {}) => {
    return api.get('/expenses', { params: filters });
  },

  create: async (data) => {
    return api.post('/expenses', data);
  },

  update: async (id, data) => {
    return api.put(`/expenses/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/expenses/${id}`);
  },
};

// ===== REPORTS API =====
export const reportsAPI = {
  getFleetUtilization: async () => {
    return api.get('/reports/fleet-utilization');
  },

  getRevenue: async () => {
    return api.get('/reports/revenue');
  },

  getFuelEfficiency: async () => {
    return api.get('/reports/fuel-efficiency');
  },

  getTripsReport: async (filters = {}) => {
    return api.get('/reports/trips', { params: filters });
  },
};

// ===== NOTIFICATIONS API =====
export const notificationsAPI = {
  getAll: async () => {
    return api.get('/notifications');
  },

  markRead: async (id) => {
    return api.patch(`/notifications/${id}/read`);
  },

  markAllRead: async () => {
    return api.patch('/notifications/read-all');
  },
};

export default api;
