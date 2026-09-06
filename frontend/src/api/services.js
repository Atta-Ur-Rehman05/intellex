/**
 * Knowva MVP — Feature API services
 * Thin, typed wrappers over the FastAPI endpoints.
 */
import { apiClient } from './client.js';

/* ============ AUTH ============ */
export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  me: () => apiClient.get('/auth/me'),
};

/* ============ DOCUMENTS ============ */
export const documentsApi = {
  list: () => apiClient.get('/documents'),
  upload: (file) => {
    const form = new FormData();
    form.append('file', file);
    return apiClient.post('/documents', form, { isForm: true });
  },
  get: (id) => apiClient.get(`/documents/${id}`),
  rename: (id, name) => apiClient.patch(`/documents/${id}`, { name }),
  remove: (id) => apiClient.del(`/documents/${id}`),
};

/* ============ CONVERSATIONS ============ */
export const chatApi = {
  listConversations: () => apiClient.get('/conversations'),
  createConversation: (title) => apiClient.post('/conversations', { title }),
  getConversation: (id) => apiClient.get(`/conversations/${id}`),
  sendMessage: (conversationId, content) =>
    apiClient.post(`/conversations/${conversationId}/messages`, { content }),
};

/* ============ DASHBOARD ============ */
export const dashboardApi = {
  get: () => apiClient.get('/dashboard'),
};
