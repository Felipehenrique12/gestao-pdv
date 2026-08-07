export const API_CONFIG = {
  baseURL: typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api',
  timeout: 15000,
  retryAttempts: 2,
};

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
};
