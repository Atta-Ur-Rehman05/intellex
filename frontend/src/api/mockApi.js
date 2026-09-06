/**
 * Mock API adapter — simulates the FastAPI backend in-memory.
 * Used only when VITE_API_BASE_URL is NOT set, so the MVP frontend
 * is fully demoable before the backend exists.
 */
import { ApiError } from './client.js';

const now = () => new Date().toISOString();
const id = () => Math.random().toString(36).slice(2, 10);

let users = [{ id: 'u-seed', email: 'demo@knowva.ai', name: 'Demo User', password: 'demo1234', created_at: now() }];

let documents = [
  { id: 'doc-1', name: 'Machine_Learning_Notes.pdf', file_type: 'pdf', size_bytes: 2_412_311, status: 'ready', created_at: '2026-09-05T14:30:00Z', updated_at: '2026-09-05T14:31:12Z' },
  { id: 'doc-2', name: 'Project_Requirements.txt', file_type: 'txt', size_bytes: 42_311, status: 'ready', created_at: '2026-09-04T09:15:00Z', updated_at: '2026-09-04T09:15:40Z' },
  { id: 'doc-3', name: 'Research_Paper_Draft.pdf', file_type: 'pdf', size_bytes: 1_128_900, status: 'processing', created_at: '2026-09-06T10:02:00Z', updated_at: '2026-09-06T10:02:00Z' },
];

let conversations = [
  {
    id: 'conv-1',
    title: 'What is machine learning?',
    created_at: '2026-09-05T15:00:00Z',
    updated_at: '2026-09-05T15:04:00Z',
    messages: [
      { id: 'm-1', role: 'user', content: 'What is machine learning?', created_at: '2026-09-05T15:00:00Z' },
      {
        id: 'm-2',
        role: 'assistant',
        content:
          'Machine learning is a subset of artificial intelligence where systems learn patterns from data rather than being explicitly programmed [1]. The document describes it as training models on examples to make predictions or decisions without task-specific instructions.',
        sources: [
          { id: 1, document_id: 'doc-1', document_name: 'Machine_Learning_Notes.pdf', chunk_index: 2, page: 3, snippet: 'Machine learning (ML) is a field of study in AI that gives computers the ability to learn from data without being explicitly programmed.' },
        ],
        created_at: '2026-09-05T15:00:05Z',
      },
    ],
  },
];

let nextSourceCounter = 100;

const genAnswer = (question) =>
  `Based on your uploaded documents, here is what I found regarding **"${question.slice(0, 60)}"**:\n\n` +
  `The knowledge base indicates that this topic covers core concepts discussed in your materials [1]. ` +
  `Key points include the definitions, methodologies, and practical examples referenced across the indexed chunks.\n\n` +
  `Ask a follow-up question if you'd like me to go deeper on any specific section.`;

const genSources = () =>
  documents
    .filter((d) => d.status === 'ready')
    .slice(0, 2)
    .map((d, i) => ({
      id: i + 1,
      document_id: d.id,
      document_name: d.name,
      chunk_index: (nextSourceCounter += 3) % 17,
      page: 2 + i,
      snippet: `Relevant excerpt retrieved from ${d.name} — the chunk most similar to your question.`,
    }));

const withDelay = (data, ms = 350) => sleep(ms).then(() => data);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const err = (detail, status) => Promise.reject(new ApiError(detail, status));

export async function mockRequest(path, { method = 'GET', body } = {}) {
  const route = `${method} ${path}`;
  const m = (re) => route.match(re);

  /* ---------------- AUTH ---------------- */
  if (m(/^POST \/auth\/register$/)) {
    const { name, email, password } = body || {};
    if (!name?.trim() || !email?.trim() || !password) return err('Please fill in all fields.', 422);
    if (password.length < 8) return err('Password must be at least 8 characters.', 422);
    if (users.some((u) => u.email === email)) return err('An account with this email already exists.', 409);
    const user = { id: id(), name, email, password, created_at: now() };
    users.push(user);
    return withDelay({ access_token: `mock-${user.id}`, user: { id: user.id, name, email, created_at: user.created_at } });
  }

  if (m(/^POST \/auth\/login$/)) {
    const { email, password } = body || {};
    const user = users.find((u) => u.email === email);
    if (!user || user.password !== password) return err('Invalid email or password.', 401);
    return withDelay({ access_token: `mock-${user.id}`, user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at } });
  }

  if (m(/^GET \/auth\/me$/)) {
    return withDelay({ id: users[0].id, name: users[0].name, email: users[0].email, created_at: users[0].created_at });
  }

  /* ---------------- DASHBOARD ---------------- */
  if (m(/^GET \/dashboard$/)) {
    const recent = [...documents].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);
    return withDelay({
      total_documents: documents.length,
      total_conversations: conversations.length,
      recent_documents: recent,
    });
  }

  /* ---------------- DOCUMENTS ---------------- */
  let match;
  if ((match = m(/^GET \/documents$/))) {
    return withDelay([...documents].sort((a, b) => b.created_at.localeCompare(a.created_at)));
  }

  if (m(/^POST \/documents$/) && body instanceof FormData) {
    const file = body.get('file');
    if (!file) return err('No file provided.', 422);
    const type = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : file.name.toLowerCase().endsWith('.txt') ? 'txt' : null;
    if (!type) return err('Only PDF and TXT files are supported in the MVP.', 422);
    const doc = {
      id: id(),
      name: file.name,
      file_type: type,
      size_bytes: file.size,
      status: 'processing',
      created_at: now(),
      updated_at: now(),
    };
    documents.push(doc);
    // Simulate async RAG pipeline: processing → ready (or failed for stress-testing)
    const fail = Math.random() < 0.12;
    sleep(2600).then(() => {
      doc.status = fail ? 'failed' : 'ready';
      doc.updated_at = now();
      if (fail) doc.error_message = 'Could not extract text — the file may be corrupt or password-protected.';
    });
    return withDelay(doc, 500);
  }

  if ((match = m(/^GET \/documents\/([^/]+)$/))) {
    const doc = documents.find((d) => d.id === match[1]);
    if (!doc) return err('Document not found.', 404);
    return withDelay(doc);
  }

  if ((match = m(/^PATCH \/documents\/([^/]+)$/))) {
    const doc = documents.find((d) => d.id === match[1]);
    if (!doc) return err('Document not found.', 404);
    if (body?.name) doc.name = body.name;
    doc.updated_at = now();
    return withDelay(doc);
  }

  if ((match = m(/^DELETE \/documents\/([^/]+)$/))) {
    const exists = documents.some((d) => d.id === match[1]);
    if (!exists) return err('Document not found.', 404);
    documents = documents.filter((d) => d.id !== match[1]);
    return withDelay(null, 200);
  }

  /* ---------------- CONVERSATIONS ---------------- */
  if (m(/^GET \/conversations$/)) {
    return withDelay([...conversations].sort((a, b) => b.updated_at.localeCompare(a.updated_at)));
  }

  if (m(/^POST \/conversations$/)) {
    const conv = { id: id(), title: body?.title || 'New Chat', created_at: now(), updated_at: now(), messages: [] };
    conversations.unshift(conv);
    return withDelay(conv, 250);
  }

  if ((match = m(/^GET \/conversations\/([^/]+)$/))) {
    const conv = conversations.find((c) => c.id === match[1]);
    if (!conv) return err('Conversation not found.', 404);
    return withDelay(conv);
  }

  if ((match = m(/^POST \/conversations\/([^/]+)\/messages$/))) {
    const conv = conversations.find((c) => c.id === match[1]);
    if (!conv) return err('Conversation not found.', 404);
    const { content } = body || {};
    if (!content?.trim()) return err('Message cannot be empty.', 422);

    const userMsg = { id: id(), role: 'user', content, created_at: now() };
    conv.messages.push(userMsg);
    if (conv.title === 'New Chat') {
      conv.title = content.length > 42 ? `${content.slice(0, 42)}…` : content;
    }

    const noReadyDocs = documents.filter((d) => d.status === 'ready').length === 0;
    const assistantMsg = noReadyDocs
      ? {
          id: id(),
          role: 'assistant',
          content: "You don't have any processed documents yet. Upload a PDF or TXT file on the Documents page, wait for it to finish processing, and then ask me anything about it.",
          sources: [],
          created_at: now(),
        }
      : {
          id: id(),
          role: 'assistant',
          content: genAnswer(content),
          sources: genSources(),
          created_at: now(),
        };

    conv.messages.push(assistantMsg);
    conv.updated_at = now();
    return withDelay(assistantMsg, 1400); // simulate RAG latency
  }

  return err(`Unknown API route: ${route}`, 404);
}
