/**
 * INTELLEX MVP — Feature API services
 * Thin, typed wrappers over the FastAPI endpoints.
 */
import { apiClient } from './client.js';
import { requestWithProgress } from './client.js';

/* ============ AUTH ============ */
const normalizeUser = (user) => {
  if (!user) return user;
  return {
    ...user,
    name: user.name ?? user.full_name,
  };
};

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data, { authFlow: true }).then(normalizeUser),
  login: (data) => apiClient.post('/auth/login', data, { authFlow: true }),
  me: () => apiClient.get('/auth/me').then(normalizeUser),
  logout: () => apiClient.post('/auth/logout'),
  updateProfile: (name) => apiClient.patch('/auth/me', { full_name: name }).then(normalizeUser),
};

/* ============ DOCUMENTS ============ */
// The backend exposes canonical metadata names (`mime_type`, `file_size`),
// while the existing document UI uses `file_type` and `size_bytes`.
// Normalize once here so every document screen receives the same shape.
const normalizeDocument = (document) => {
  if (!document) return document;

  const fileType = document.file_type || (
    document.mime_type === 'application/pdf' ? 'pdf' :
      document.mime_type === 'text/plain' ? 'txt' : undefined
  );

  return {
    ...document,
    file_type: fileType,
    size_bytes: document.size_bytes ?? document.file_size,
  };
};

export const documentsApi = {
  list: async () => {
    const documents = await apiClient.get('/documents');
    return Array.isArray(documents) ? documents.map(normalizeDocument) : [];
  },
  upload: (file, onUploadProgress) => {
    const form = new FormData();
    form.append('file', file);
    return requestWithProgress('/documents', { method: 'POST', body: form, onUploadProgress })
      .then(normalizeDocument);
  },
  get: (id) => apiClient.get(`/documents/${id}`).then(normalizeDocument),
  rename: (id, name) => apiClient.patch(`/documents/${id}`, { name }).then(normalizeDocument),
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
