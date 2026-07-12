/**
 * TransitOps API Service Layer
 * All API calls are isolated here for easy backend integration.
 * Replace BASE_URL and remove dummy data imports when backend is ready.
 */

import axios from 'axios';
import {
  dummyVehicles, dummyDrivers, dummyTrips, dummyMaintenance,
  dummyFuelLogs, dummyExpenses, dummyNotifications, dashboardKPIs,
  monthlyRevenueData, fleetUtilizationData, fuelCostData,
  vehicleStatusData, tripsByRegionData, driverSafetyData
} from '../utils/dummy';

// ===== AXIOS INSTANCE =====
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

// ===== SIMULATE DELAY (remove in production) =====
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// ===== AUTH API =====
export const authAPI = {
  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @param {string} role
   */
  login: async (email, password, role) => {
    // TODO: Replace with: return api.post('/auth/login', { email, password });
    await delay(800);
    return { success: true, token: 'mock-jwt-token', message: 'Login successful' };
  },

  logout: async () => {
    // TODO: Replace with: return api.post('/auth/logout');
    await delay(200);
    return { success: true };
  },

  forgotPassword: async (email) => {
    // TODO: Replace with: return api.post('/auth/forgot-password', { email });
    await delay(600);
    return { success: true, message: 'Password reset email sent' };
  },
};

// ===== DASHBOARD API =====
export const dashboardAPI = {
  getKPIs: async (filters = {}) => {
    // TODO: Replace with: return api.get('/dashboard/kpis', { params: filters });
    await delay(500);
    return dashboardKPIs;
  },

  getRecentTrips: async () => {
    // TODO: Replace with: return api.get('/dashboard/recent-trips');
    await delay(400);
    return dummyTrips.slice(0, 6);
  },

  getActivityTimeline: async () => {
    // TODO: Replace with: return api.get('/dashboard/activity');
    await delay(300);
    return [];
  },
};

// ===== VEHICLES API =====
export const vehiclesAPI = {
  getAll: async (filters = {}) => {
    // TODO: Replace with: return api.get('/vehicles', { params: filters });
    await delay(400);
    return dummyVehicles;
  },

  getById: async (id) => {
    // TODO: Replace with: return api.get(`/vehicles/${id}`);
    await delay(300);
    return dummyVehicles.find(v => v.id === id);
  },

  create: async (data) => {
    // TODO: Replace with: return api.post('/vehicles', data);
    await delay(600);
    return { ...data, id: `V${Date.now()}` };
  },

  update: async (id, data) => {
    // TODO: Replace with: return api.put(`/vehicles/${id}`, data);
    await delay(500);
    return { ...data, id };
  },

  delete: async (id) => {
    // TODO: Replace with: return api.delete(`/vehicles/${id}`);
    await delay(400);
    return { success: true };
  },

  getStatusSummary: async () => {
    // TODO: Replace with: return api.get('/vehicles/status-summary');
    await delay(300);
    return vehicleStatusData;
  },
};

// ===== DRIVERS API =====
export const driversAPI = {
  getAll: async (filters = {}) => {
    // TODO: Replace with: return api.get('/drivers', { params: filters });
    await delay(400);
    return dummyDrivers;
  },

  getById: async (id) => {
    // TODO: Replace with: return api.get(`/drivers/${id}`);
    await delay(300);
    return dummyDrivers.find(d => d.id === id);
  },

  create: async (data) => {
    // TODO: Replace with: return api.post('/drivers', data);
    await delay(600);
    return { ...data, id: `D${Date.now()}` };
  },

  update: async (id, data) => {
    // TODO: Replace with: return api.put(`/drivers/${id}`, data);
    await delay(500);
    return { ...data, id };
  },

  delete: async (id) => {
    // TODO: Replace with: return api.delete(`/drivers/${id}`);
    await delay(400);
    return { success: true };
  },

  getSafetyData: async () => {
    // TODO: Replace with: return api.get('/drivers/safety-summary');
    await delay(300);
    return driverSafetyData;
  },
};

// ===== TRIPS API =====
export const tripsAPI = {
  getAll: async (filters = {}) => {
    // TODO: Replace with: return api.get('/trips', { params: filters });
    await delay(400);
    return dummyTrips;
  },

  getById: async (id) => {
    // TODO: Replace with: return api.get(`/trips/${id}`);
    await delay(300);
    return dummyTrips.find(t => t.id === id);
  },

  create: async (data) => {
    // TODO: Replace with: return api.post('/trips', data);
    await delay(700);
    return { ...data, id: `TR${Date.now()}`, status: 'Draft' };
  },

  update: async (id, data) => {
    // TODO: Replace with: return api.put(`/trips/${id}`, data);
    await delay(500);
    return { ...data, id };
  },

  updateStatus: async (id, status) => {
    // TODO: Replace with: return api.patch(`/trips/${id}/status`, { status });
    await delay(400);
    return { id, status, success: true };
  },

  delete: async (id) => {
    // TODO: Replace with: return api.delete(`/trips/${id}`);
    await delay(400);
    return { success: true };
  },
};

// ===== MAINTENANCE API =====
export const maintenanceAPI = {
  getAll: async (filters = {}) => {
    // TODO: Replace with: return api.get('/maintenance', { params: filters });
    await delay(400);
    return dummyMaintenance;
  },

  getById: async (id) => {
    // TODO: Replace with: return api.get(`/maintenance/${id}`);
    await delay(300);
    return dummyMaintenance.find(m => m.id === id);
  },

  create: async (data) => {
    // TODO: Replace with: return api.post('/maintenance', data);
    await delay(600);
    return { ...data, id: `MNT${Date.now()}` };
  },

  update: async (id, data) => {
    // TODO: Replace with: return api.put(`/maintenance/${id}`, data);
    await delay(500);
    return { ...data, id };
  },

  delete: async (id) => {
    // TODO: Replace with: return api.delete(`/maintenance/${id}`);
    await delay(400);
    return { success: true };
  },
};

// ===== FUEL API =====
export const fuelAPI = {
  getAll: async (filters = {}) => {
    // TODO: Replace with: return api.get('/fuel', { params: filters });
    await delay(400);
    return dummyFuelLogs;
  },

  create: async (data) => {
    // TODO: Replace with: return api.post('/fuel', data);
    await delay(600);
    return { ...data, id: `FL${Date.now()}` };
  },

  update: async (id, data) => {
    // TODO: Replace with: return api.put(`/fuel/${id}`, data);
    await delay(500);
    return { ...data, id };
  },

  delete: async (id) => {
    // TODO: Replace with: return api.delete(`/fuel/${id}`);
    await delay(400);
    return { success: true };
  },

  getCostData: async () => {
    // TODO: Replace with: return api.get('/fuel/cost-data');
    await delay(300);
    return fuelCostData;
  },
};

// ===== EXPENSES API =====
export const expensesAPI = {
  getAll: async (filters = {}) => {
    // TODO: Replace with: return api.get('/expenses', { params: filters });
    await delay(400);
    return dummyExpenses;
  },

  create: async (data) => {
    // TODO: Replace with: return api.post('/expenses', data);
    await delay(600);
    return { ...data, id: `EXP${Date.now()}` };
  },

  update: async (id, data) => {
    // TODO: Replace with: return api.put(`/expenses/${id}`, data);
    await delay(500);
    return { ...data, id };
  },

  delete: async (id) => {
    // TODO: Replace with: return api.delete(`/expenses/${id}`);
    await delay(400);
    return { success: true };
  },
};

// ===== REPORTS API =====
export const reportsAPI = {
  getFleetUtilization: async () => {
    // TODO: Replace with: return api.get('/reports/fleet-utilization');
    await delay(500);
    return fleetUtilizationData;
  },

  getRevenue: async () => {
    // TODO: Replace with: return api.get('/reports/revenue');
    await delay(500);
    return monthlyRevenueData;
  },

  getFuelEfficiency: async () => {
    // TODO: Replace with: return api.get('/reports/fuel-efficiency');
    await delay(400);
    return dummyVehicles.map(v => {
      const fuelLogs = dummyFuelLogs.filter(f => f.vehicleId === v.id);
      const totalFuel = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
      const totalDist = dummyTrips
        .filter(t => t.vehicleId === v.id && t.status === 'Completed')
        .reduce((sum, t) => sum + t.distance, 0);
      const maint = dummyMaintenance
        .filter(m => m.vehicleId === v.id)
        .reduce((sum, m) => sum + m.cost, 0);
      const fuel = fuelLogs.reduce((sum, f) => sum + f.totalCost, 0);
      const rev = dummyTrips
        .filter(t => t.vehicleId === v.id && t.status === 'Completed')
        .reduce((sum, t) => sum + t.revenue, 0);
      const roi = v.acquisitionCost > 0
        ? (((rev - (maint + fuel)) / v.acquisitionCost) * 100).toFixed(2)
        : 0;
      return {
        id: v.id,
        vehicle: v.regNumber,
        name: v.name,
        efficiency: totalFuel > 0 ? (totalDist / totalFuel).toFixed(2) : '—',
        totalDistance: totalDist,
        totalFuel,
        fuelCost: fuel,
        maintenanceCost: maint,
        totalCost: fuel + maint,
        revenue: rev,
        roi,
      };
    });
  },

  getTripsReport: async (filters = {}) => {
    // TODO: Replace with: return api.get('/reports/trips', { params: filters });
    await delay(400);
    return tripsByRegionData;
  },
};

// ===== NOTIFICATIONS API =====
export const notificationsAPI = {
  getAll: async () => {
    // TODO: Replace with: return api.get('/notifications');
    await delay(300);
    return dummyNotifications;
  },

  markRead: async (id) => {
    // TODO: Replace with: return api.patch(`/notifications/${id}/read`);
    await delay(200);
    return { success: true };
  },

  markAllRead: async () => {
    // TODO: Replace with: return api.patch('/notifications/read-all');
    await delay(300);
    return { success: true };
  },
};

export default api;
