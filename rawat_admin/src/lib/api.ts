import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('admin_refresh_token');
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem('admin_token', data.data.accessToken);
        localStorage.setItem('admin_refresh_token', data.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth APIs ───────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  getProfile: () => api.get('/auth/profile'),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch('/auth/change-password', { currentPassword, newPassword }),
};

// ─── Analytics APIs ──────────────────────────────────────────

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getLandingPage: () => api.get('/analytics/landing-page'),
  getCategories: () => api.get('/analytics/categories'),
  getProducts: (limit = 20) =>
    api.get(`/analytics/products?limit=${limit}`),
};

// ─── Category APIs ───────────────────────────────────────────

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
  create: (formData: FormData) =>
    api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    api.patch(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// ─── Product APIs ────────────────────────────────────────────

export const productApi = {
  getAll: () => api.get('/products'),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  create: (formData: FormData) =>
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    api.patch(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// ─── Inquiry APIs ────────────────────────────────────────────

export const inquiryApi = {
  getAll: () => api.get('/inquiries'),
  getById: (id: string) => api.get(`/inquiries/${id}`),
  updateStatus: (id: string, status: string, adminNotes?: string) =>
    api.patch(`/inquiries/${id}/status`, { status, adminNotes }),
};

export default api;
