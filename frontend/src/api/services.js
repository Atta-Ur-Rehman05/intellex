/**
 * Knowva MVP — Feature API services
 * Thin, typed wrappers over the FastAPI endpoints.
 */
import { apiClient } from './client.js';
import { requestWithProgress } from './client.js';

/* ============ AUTH ============ */
export const authApi = {
  register: (data) => apiClient.post('/auth/register', data, { authFlow: true }),
  login: (data) => apiClient.post('/auth/login', data, { authFlow: true }),
  me: () => apiClient.get('/auth/me'),
  updateProfile: (name) => apiClient.patch('/auth/me', { name }),
};

/* ============ DOCUMENTS ============ */
export const documentsApi = {
  list: () => apiClient.get('/documents'),
  upload: (file, onUploadProgress) => {
    const form = new FormData();
    form.append('file', file);
    if (import.meta.env?.VITE_API_BASE_URL) {
      return requestWithProgress('/documents', { method: 'POST', body: form, onUploadProgress });
    }
    // Mock mode: simulate byte progress locally so the UI path is identical
    return new Promise((resolve, reject) => {
      let fake = 0;
      const timer = setInterval(() => {
        fake = Math.min(90, fake + 8 + Math.random() * 14);
        onUploadProgress?.(Math.round(fake));
      }, 180);
      apiClient.post('/documents', form, { isForm: true })
        .then(resolve, reject)
        .finally(() => clearInterval(timer));
    });
  },
  get: (id) => apiClient.get(`/documents/${id}`),
  rename: (id, name) => apiClient.patch(`/documents/${id}`, { name }),
  remove: (id) => apiClient.del(`/documents/${id}`),
};

/* ============ CONVERSATIONS ============ */
export const chatApi = {
  listConversations: () => apiClient.get('/conversations'),
  createConversation: (title, documentIds = []) =>
    apiClient.post('/conversations', { title, document_ids: documentIds }),
  getConversation: (id) => apiClient.get(`/conversations/${id}`),
  removeConversation: (id) => apiClient.del(`/conversations/${id}`),
  sendMessage: (conversationId, content) =>
    apiClient.post(`/conversations/${conversationId}/messages`, { content }),
};

/* ============ DASHBOARD ============ */
export const dashboardApi = {
  get: () => apiClient.get('/dashboard'),
};
