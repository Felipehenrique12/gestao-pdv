import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { API_CONFIG } from '../config';

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('erp_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle Token Expiration (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Simulate refresh token call
        const mockNewToken = `refreshed_token_${Date.now()}`;
        localStorage.setItem('erp_auth_token', mockNewToken);
        processQueue(null, mockNewToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${mockNewToken}`;
        }
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('erp_auth_token');
        toast.error('Sessão expirada. Faça login novamente.');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Global Error Treatment (Toast feedback)
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      toast.error('Tempo limite de conexão excedido. Tente novamente.');
    } else if (!error.response) {
      // Network failure or API route intercepted locally
      console.warn('Network issue or mock fallback mode active.');
    } else {
      const status = error.response.status;
      if (status >= 500) {
        toast.error('Erro interno no servidor de API.');
      } else if (status === 403) {
        toast.error('Acesso não autorizado a este recurso.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
