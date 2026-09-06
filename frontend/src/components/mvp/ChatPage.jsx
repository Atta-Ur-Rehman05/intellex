import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles, Plus, Menu, Trash2, FileText, ExternalLink,
  Copy, Check, ArrowUp, Loader2, MessageSquare, AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Modal, ConfirmDialog } from '../ui/Modal.jsx';
import { useToast } from '../ui/Toast.jsx';
import { chatApi } from '../../api/services.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ChatCodeBlock } from '../chat/ChatCodeBlock.jsx';
import { cn } from '../../lib/utils.js';

/* ---------- Small markdown-ish renderer: code blocks + inline [n] citations ---------- */
const MessageContent = ({ message, onSourceClick }) => {
  const { content, sources = [] } = message;
  const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = [];
  let last = 0;
  let m;

  while ((m = codeRegex.exec(content)) !== null) {
    if (m.index > last) parts.push({ type: 'text', value: content.slice(last, m.index) });
    parts.push({ type: 'code', language: m[1] || 'code', value: m[2] });
    last = m.index + m[0].length;
  }
  if (last < content.length) parts.push({ type: 'text', value: content.slice(last) });

  const renderText = (text, keyBase) => {
    const citeRegex = /\[(\d+)\]/g;
    const segs = [];
    let tLast = 0;
    let cm;
    while ((cm = citeRegex.exec(text)) !== null) {
      if (cm.index > tLast) segs.push(text.slice(tLast, cm.index));
      const n = parseInt(cm[1]);
      const src = sources.find((s) => s.id === n);
      segs.push(
        <button
          key={`${keyBase}-c${cm.index}`}
          type="button"
          onClick={() => src && onSourceClick?.(src)}
          disabled={!src}
          className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold border transition-all mx-0.5",
            src
              ? "bg-brand-500/15 text-brand-400 border-brand-500/30 hover:bg-brand-500/25 cursor-pointer"
              : "bg-surface-hover text-muted border-border-default cursor-default"
          )}
          title={src ? `${src.document_name} — ${src.snippet?.slice(0, 80)}…` : undefined}
        >
          [{n}]
        </button>
      );
      tLast = cm.index + cm[0].length;
    }
    if (tLast < text.length) segs.push(text.slice(tLast));

    // minimal **bold** support
    return (
      <div key={keyBase} className="whitespace-pre-wrap text-xs leading-relaxed text-primary">
        {segs}
      </div>
    );
  };

  return (
    <div className="space-y-2.5">
      {parts.map((p, i) =>
        p.type === 'code'
          ? <ChatCodeBlock key={i} language={p.language} code={p.value} />
          : renderText(p.value, `t${i}`)
      )}
    </div>
  );
};

/* ---------- Source citation card row ---------- */
const SourceCard = ({ source, onOpenDoc }) => (
  <button
    type="button"
    onClick={() => onOpenDoc?.(source)}
    className="group w-full flex items-start gap-2.5 p-2.5 rounded-xl bg-canvas border border-border-default hover:border-brand-500/40 transition-all text-left cursor-pointer"
  >
    <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
      <FileText className="w-3.5 h-3.5" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold text-primary truncate group-hover:text-brand-400 transition-colors">
        {source.document_name}
      </p>
      <p className="text-[10px] text-muted line-clamp-1">
        {source.snippet}
      </p>
    </div>
    <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-brand-400 shrink-0 mt-1 transition-colors" />
  </button>
);

/* ============ Chat Page ============ */
export const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const docContext = searchParams.get('doc')
    ? { id: searchParams.get('doc'), name: searchParams.get('name') || 'Document' }
    : null;

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isConvLoading, setIsConvLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteConv, setDeleteConv] = useState(null);
  const [activeSource, setActiveSource] = useState(null);

  const endRef = useRef(null);
  const textareaRef = useRef(null);

  /* Load conversation list */
  const loadConversations = useCallback(async () => {
    try {
      const list = await chatApi.listConversations();
      setConversations(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  /* Load active conversation when route changes */
  useEffect(() => {
    if (conversationId) {
      let cancelled = false;
      setIsConvLoading(true);
      chatApi.getConversation(conversationId)
        .then((conv) => { if (!cancelled) setActiveConv(conv); })
        .catch((err) => { if (!cancelled) setError(err.message); })
        .finally(() => { if (!cancelled) setIsConvLoading(false); });
      return () => { cancelled = true; };
    }
    setActiveConv(null);
    setIsConvLoading(false);
  }, [conversationId]);

  /* Auto scroll */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isSending]);

  /* Auto-grow textarea */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  /* Create conversation on first message */
  const ensureConversation = async () => {
    if (conversationId) return activeConv;
    const conv = await chatApi.createConversation(docContext ? `About ${docContext.name}` : 'New Chat');
    setConversations((prev) => [conv, ...prev]);
    navigate(`/app/chat/${conv.id}`, { replace: true });
    setActiveConv(conv);
    return conv;
  };

  /* Send message */
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setError('');
    setInput('');

    let conv;
    try {
      conv = await ensureConversation();
    } catch (err) {
      setError(err.message || 'Could not start a new conversation.');
      return;
    }

    // Optimistic user message
    const tempId = `temp-${Date.now()}`;
    setActiveConv((prev) => ({
      ...conv,
      messages: [...(prev?.messages || []), { id: tempId, role: 'user', content: text, created_at: new Date().toISOString() }],
    }));

    setIsSending(true);
    try {
      await chatApi.sendMessage(conv.id, text);
      // Refresh the conversation to get canonical message list
      const fresh = await chatApi.getConversation(conv.id);
      setActiveConv(fresh);
      loadConversations(); // refresh titles/order
    } catch (err) {
      setError(err.message || 'The AI could not answer right now. Please try again.');
      // Keep user message visible; remove nothing.
    } finally {
      setIsSending(false);
    }
  };

  const handleNewChat = () => {
    navigate('/app/chat');
    setInput('');
    setIsSidebarOpen(false);
    textareaRef.current?.focus();
  };

  const handleDeleteConv = async () => {
    try {
      // MVP mock has no DELETE endpoint defined; remove locally
      setConversations((prev) => prev.filter((c) => c.id !== deleteConv));
      if (conversationId === deleteConv) navigate('/app/chat', { replace: true });
      toast({ title: 'Conversation deleted', type: 'success' });
    } finally {
      setDeleteConv(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openSourceDoc = (source) => {
    navigate(`/app/documents/${source.document_id}`);
  };

  const suggestions = [
    'Summarize my documents',
    'What are the key concepts discussed?',
    'Give me the main takeaways with sources',
  ];

  return (
    <div className="flex gap-4 h-[calc(100vh-7rem)] animate-in fade-in duration-200">
      {/* ============ Conversation history sidebar ============ */}
      <aside
        className={cn(
          "w-64 shrink-0 flex flex-col bg-surface rounded-2xl border border-border-default shadow-xs p-3.5 space-y-3",
          isSidebarOpen
            ? "fixed inset-y-14 left-2 right-2 z-40 w-auto shadow-2xl md:static md:inset-auto md:w-64"
            : "hidden md:flex"
        )}
        aria-label="Conversation history"
      >
        <Button
          variant="primary"
          size="sm"
          onClick={handleNewChat}
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full font-semibold h-9"
        >
          New Chat
        </Button>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 no-scrollbar min-h-0">
          {isHistoryLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-surface-hover/60 animate-pulse" />
            ))
          ) : conversations.length === 0 ? (
            <div className="pt-8 text-center space-y-2">
              <MessageSquare className="w-6 h-6 text-muted mx-auto" />
              <p className="text-[11px] text-muted">No conversations yet</p>
            </div>
          ) : (
            conversations.map((c) => {
              const isActive = c.id === conversationId;
              return (
                <div key={c.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => { navigate(`/app/chat/${c.id}`); setIsSidebarOpen(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer pr-9",
                      isActive
                        ? "bg-brand-600/10 border border-brand-500/40 text-primary"
                        : "text-secondary hover:text-primary hover:bg-surface-hover border border-transparent"
                    )}
                  >
                    <p className={cn("text-xs truncate font-semibold", isActive && "text-brand-400")}>
                      {c.title}
                    </p>
                    <p className="text-[10px] text-muted mt-0.5">
                      {new Date(c.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      {' · '}
                      {c.messages?.length || 0} messages
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConv(c)}
                    aria-label={`Delete conversation "${c.title}"`}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {isSidebarOpen && (
          <Button variant="secondary" size="sm" onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            Close
          </Button>
        )}
      </aside>

      {/* ============ Main chat column ============ */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface rounded-2xl border border-border-default shadow-xs overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-border-default flex items-center justify-between gap-3 bg-surface/90 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg border border-border-default text-secondary hover:text-primary cursor-pointer"
              aria-label="Open conversation history"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-primary truncate">
                {activeConv?.title || docContext ? (activeConv?.title || `Ask about: ${docContext.name}`) : 'New Chat'}
              </h2>
              <p className="text-[10px] text-muted font-mono truncate">
                {docContext ? `Document scope: ${docContext.name}` : 'Answers cite your uploaded documents'}
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleNewChat} leftIcon={<Plus className="w-3.5 h-3.5" />} className="shrink-0">
            <span className="hidden sm:inline">New</span>
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 no-scrollbar">
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Empty new chat state */}
            {!activeConv && !isConvLoading && (
              <div className="pt-10 sm:pt-16 text-center space-y-6 max-w-md mx-auto">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    {docContext ? `Ask anything about "${docContext.name}"` : `Hi ${user?.name?.split(' ')[0] || 'there'} — what do you want to know?`}
                  </h3>
                  <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                    {docContext
                      ? 'Your questions will be answered using this document, with citations back to the source.'
                      : 'Ask questions about your uploaded documents. Every answer shows which sources were used.'}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                      className="px-3 py-1.5 rounded-full bg-surface-hover/70 hover:bg-surface-hover border border-border-subtle hover:border-brand-500/40 text-[11px] text-secondary hover:text-primary transition-all cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading conversation */}
            {isConvLoading && (
              <div className="space-y-4 max-w-3xl mx-auto" role="status" aria-busy="true">
                <div className="flex justify-end">
                  <div className="w-2/3 h-16 rounded-2xl rounded-br-md bg-brand-500/10 animate-pulse" />
                </div>
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 animate-pulse shrink-0" />
                  <div className="w-3/4 h-24 rounded-2xl rounded-tl-md bg-surface-hover/60 animate-pulse" />
                </div>
              </div>
            )}

            {/* Message stream */}
            {activeConv && !isConvLoading && (
              <>
                {activeConv.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} onSourceClick={setActiveSource} />
                ))}

                {/* Generating indicator */}
                {isSending && (
                  <div className="flex gap-2.5 animate-in fade-in">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="p-4 rounded-2xl rounded-tl-md bg-surface border border-border-default shadow-xs space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-muted font-mono">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Searching documents & composing answer…</span>
                      </div>
                      <div className="flex gap-1.5" aria-hidden="true">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-500 max-w-md mx-auto" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => setError('')}
                    className="ml-2 underline underline-offset-2 hover:no-underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="p-3 sm:p-4 border-t border-border-default bg-surface/90 backdrop-blur-md shrink-0">
          <div className="max-w-3xl mx-auto rounded-2xl border border-border-default bg-canvas focus-within:border-brand-500/70 focus-within:ring-1 focus-within:ring-brand-500/20 transition-all p-2.5">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={docContext ? `Ask a question about "${docContext.name}"…` : 'Ask a question about your documents… (Shift+Enter for new line)'}
              rows={1}
              disabled={isSending}
              className="w-full bg-transparent text-sm text-primary placeholder:text-muted focus:outline-none resize-none max-h-36 leading-relaxed px-1"
              aria-label="Chat message input"
            />
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-[10px] text-muted font-mono pl-1 hidden sm:block">
                {docContext ? `Scope: ${docContext.name}` : 'Scope: all your documents'}
              </span>
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                aria-label="Send message"
                className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                  input.trim() && !isSending
                    ? "bg-brand-600 hover:bg-brand-500 text-white shadow-xs"
                    : "bg-surface-hover text-muted border border-border-subtle cursor-not-allowed opacity-50"
                )}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Source detail modal ============ */}
      <Modal
        isOpen={activeSource !== null}
        onClose={() => setActiveSource(null)}
        title="Source Citation"
        description="The document chunk used to generate part of the answer."
        size="md"
      >
        {activeSource && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-500/5 border border-brand-500/20">
              <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary break-all">{activeSource.document_name}</p>
                <p className="text-[10px] font-mono text-muted mt-0.5">
                  Chunk #{activeSource.chunk_index}
                  {activeSource.page ? ` · Page ${activeSource.page}` : ''}
                </p>
              </div>
            </div>
            <blockquote className="p-4 rounded-xl bg-canvas border border-border-default text-xs text-secondary leading-relaxed">
              &ldquo;{activeSource.snippet}&rdquo;
            </blockquote>
            <div className="flex justify-end gap-2.5">
              <Button variant="secondary" size="sm" onClick={() => setActiveSource(null)}>Close</Button>
              <Button
                size="sm"
                onClick={() => { setActiveSource(null); openSourceDoc(activeSource); }}
                leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Open Document
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete conversation confirm */}
      <ConfirmDialog
        isOpen={deleteConv !== null}
        onClose={() => setDeleteConv(null)}
        onConfirm={handleDeleteConv}
        title="Delete Conversation"
        message={`"${deleteConv?.title}" and its messages will be removed. This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

/* ---------- Message bubble ---------- */
const MessageBubble = ({ message, onSourceClick }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copy = () => {
    navigator.clipboard?.writeText(message.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={cn("flex gap-2.5 animate-in fade-in duration-200", isUser && "justify-end")}>
      {!isUser && (
        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0 mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div className={cn("space-y-2 max-w-[88%] sm:max-w-[78%]", isUser && "items-end")}>
        {/* Bubble */}
        {isUser ? (
          <div className="p-3.5 px-4 rounded-2xl rounded-tr-md bg-brand-600 text-white text-xs leading-relaxed shadow-xs whitespace-pre-wrap selection:bg-white/30">
            {message.content}
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl rounded-tl-md bg-surface border border-border-default shadow-xs space-y-3">
            <MessageContent message={message} onSourceClick={onSourceClick} />

            {/* Sources footer */}
            {message.sources?.length > 0 && (
              <div className="pt-2.5 border-t border-border-subtle space-y-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">Sources</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {message.sources.map((s) => (
                    <SourceCard key={s.id} source={s} onOpenDoc={onSourceClick} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Copy action for assistant */}
        {!isUser && (
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1 p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer text-[10px]"
            aria-label="Copy answer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-xl bg-surface-hover border border-border-default flex items-center justify-center text-secondary text-[10px] font-bold shrink-0 mt-1">
          You
        </div>
      )}
    </div>
  );
};
