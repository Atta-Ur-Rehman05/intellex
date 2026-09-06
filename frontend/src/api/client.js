/**
 * Knowva API Types (JSDoc)
 *
 * AuthUser:      { id, email, name, created_at }
 * Document:      { id, name, file_type, size_bytes, status, created_at, updated_at, error_message? }
 *                status: 'uploading' | 'processing' | 'ready' | 'failed'
 * Conversation:  { id, title, created_at, updated_at }
 * Message:       { id, role: 'user'|'assistant', content, sources?, created_at }
 * Source:        { id, document_id, document_name, chunk_index, page?, snippet }
 * DashboardData: { total_documents, total_conversations, recent_documents: Document[] }
 */

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const TOKEN_KEY = 'knowva_access_token';

export const tokenStore = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set: (t) => { try { localStorage.setItem(TOKEN_KEY, t); } catch { /* noop */ } },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* noop */ } },
};

/**
 * Low-level request helper. Swap `mockRequest` for the real fetch adapter
 * below once the FastAPI backend is live.
 */
export async function request(path, { method = 'GET', body, headers = {}, isForm = false } = {}) {
  if (!import.meta.env.VITE_API_BASE_URL) {
    const { mockRequest } = await import('./mockApi.js');
    return mockRequest(path, { method, body });
  }

  const token = tokenStore.get();
  const finalHeaders = { ...headers };
  if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  if (body && !isForm) finalHeaders['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError('Network error — please check your connection and try again.', 0);
  }

  if (res.status === 401) {
    tokenStore.clear();
    throw new ApiError('Your session has expired. Please sign in again.', 401);
  }

  if (!res.ok) {
    let details = null;
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      details = data;
      message = typeof data.detail === 'string'
        ? data.detail
        : Object.values(data).flat?.()[0]?.msg || data.message || message;
    } catch { /* non-JSON error body */ }
    throw new ApiError(message, res.status, details);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body, opts = {}) => request(path, { method: 'POST', body, ...opts }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};
