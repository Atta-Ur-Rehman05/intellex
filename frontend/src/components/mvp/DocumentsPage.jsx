import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  UploadCloud, Search, X, MoreVertical, Pencil, Trash2, Sparkles,
  FileText, AlertCircle, Loader2
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { Modal, ConfirmDialog } from '../ui/Modal.jsx';
import { Input } from '../ui/Input.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { DocumentTableSkeleton } from '../ui/Skeleton.jsx';
import { useToast } from '../ui/Toast.jsx';
import { documentsApi } from '../../api/services.js';
import { DocumentStatusBadge, DocumentTypeIcon, formatDate, formatBytes } from './documentShared.jsx';
import { cn } from '../../lib/utils.js';

/* ============ Upload Modal ============ */
const UploadModal = ({ isOpen, onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | uploading | processing | done | error
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);
  const { toast } = useToast();

  const reset = () => {
    setFile(null);
    setPhase('idle');
    setProgress(0);
    setErrorMsg('');
  };

  const pickFile = (f) => {
    if (!f) return;
    const ext = f.name.toLowerCase();
    if (!ext.endsWith('.pdf') && !ext.endsWith('.txt')) {
      setPhase('error');
      setErrorMsg('Only PDF and TXT files are supported in this MVP.');
      return;
    }
    setFile(f);
    setPhase('idle');
    setErrorMsg('');
  };

  const startUpload = async () => {
    if (!file) return;
    setPhase('uploading');
    setProgress(0);

    // Simulated XHR-ish progress while the mock/backend processes
    const timer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 18 : p));
    }, 250);

    try {
      await documentsApi.upload(file);
      clearInterval(timer);
      setProgress(100);
      setPhase('processing');
      toast({
        title: 'Upload complete',
        description: `"${file.name}" is being processed. It will be ready shortly.`,
        type: 'success',
      });
      onUploaded?.();
      // Show processing state briefly, then close
      setTimeout(() => {
        setPhase('done');
        onClose();
        reset();
      }, 1600);
    } catch (err) {
      clearInterval(timer);
      setPhase('error');
      setErrorMsg(err.message || 'Upload failed. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={phase === 'uploading' ? undefined : () => { onClose(); reset(); }}
      title="Upload Document"
      description="Add a PDF or TXT file to your knowledge base."
      size="md"
    >
      <div className="space-y-5">
        {phase === 'error' && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-500" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dropzone */}
        {phase === 'idle' || phase === 'error' ? (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className={cn(
                "w-full p-8 rounded-2xl border-2 border-dashed flex flex-col items-center gap-3 transition-all cursor-pointer",
                isDragging
                  ? "border-brand-500 bg-brand-500/8 scale-[1.01]"
                  : "border-border-strong hover:border-brand-400/60 bg-canvas"
              )}
              aria-label="Choose a file or drag it here"
            >
              <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/25">
                <UploadCloud className="w-7 h-7 text-brand-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-primary">
                  {file ? file.name : 'Drop your file here'}
                </p>
                <p className="text-xs text-secondary mt-1">
                  {file ? formatBytes(file.size) : 'or click to browse — PDF and TXT, max 20 MB'}
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
            </button>

            <div className="flex items-center justify-end gap-2.5">
              <Button variant="secondary" size="sm" onClick={() => { onClose(); reset(); }}>Cancel</Button>
              <Button size="sm" disabled={!file} onClick={startUpload} leftIcon={<UploadCloud className="w-3.5 h-3.5" />}>
                Upload
              </Button>
            </div>
          </>
        ) : null}

        {/* Uploading progress */}
        {phase === 'uploading' && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-primary truncate">{file?.name}</p>
                <p className="text-[10px] text-muted font-mono">{formatBytes(file?.size)} · uploading…</p>
              </div>
              <span className="font-mono text-xs font-bold text-brand-400">{Math.min(100, Math.round(progress))}%</span>
            </div>
            <div className="h-2 rounded-full bg-surface-hover overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>
        )}

        {/* Processing state */}
        {phase === 'processing' && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            <div>
              <p className="text-sm font-semibold text-primary">Processing document…</p>
              <p className="text-xs text-secondary mt-1">
                Knowva is extracting text and building embeddings for &quot;{file?.name}&quot;.
              </p>
            </div>
            <div className="flex items-center gap-1.5 pt-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

/* ============ Row actions menu ============ */
const RowMenu = ({ doc, onRename, onDelete, onAskAi }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const item = (icon, label, handler, danger) => (
    <button
      type="button"
      role="menuitem"
      onClick={() => { setOpen(false); handler?.(); }}
      className={cn(
        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer",
        danger ? "text-red-500 hover:bg-red-500/10" : "text-secondary hover:text-primary hover:bg-surface-hover"
      )}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${doc.name}`}
        className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 p-1.5 rounded-xl bg-surface border border-border-default shadow-xl z-20 animate-in fade-in zoom-in-95 duration-150" role="menu">
          {item(<Pencil className="w-3.5 h-3.5" />, 'Rename', () => onRename(doc))}
          {item(<Sparkles className="w-3.5 h-3.5 text-purple-400" />, 'Ask AI about this', () => onAskAi(doc))}
          {item(<Trash2 className="w-3.5 h-3.5" />, 'Delete', () => onDelete(doc), true)}
        </div>
      )}
    </div>
  );
};

/* ============ Documents Page ============ */
export const DocumentsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');

  const [isUploadOpen, setIsUploadOpen] = useState(searchParams.get('upload') === '1');
  const [renameDoc, setRenameDoc] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteDoc, setDeleteDoc] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const list = await documentsApi.list();
      setDocs(list);
    } catch (err) {
      setLoadError(err.message || 'Could not load documents.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Poll processing docs until they settle (simulates RAG pipeline status)
  useEffect(() => {
    const hasPending = docs.some((d) => d.status === 'uploading' || d.status === 'processing');
    if (!hasPending) return;
    const t = setInterval(load, 1500);
    return () => clearInterval(t);
  }, [docs, load]);

  const filtered = docs.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));

  const handleRenameSave = async () => {
    if (!renameValue.trim()) return;
    try {
      const updated = await documentsApi.rename(renameDoc.id, renameValue.trim());
      setDocs((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      toast({ title: 'Document renamed', description: `Now called "${updated.name}".`, type: 'success' });
    } catch (err) {
      toast({ title: 'Rename failed', description: err.message, type: 'error' });
    } finally {
      setRenameDoc(null);
    }
  };

  const handleDelete = async () => {
    try {
      await documentsApi.remove(deleteDoc.id);
      setDocs((prev) => prev.filter((d) => d.id !== deleteDoc.id));
      toast({ title: 'Document deleted', description: `"${deleteDoc.name}" was removed.`, type: 'success' });
    } catch (err) {
      toast({ title: 'Delete failed', description: err.message, type: 'error' });
    } finally {
      setDeleteDoc(null);
    }
  };

  const handleAskAi = (doc) => {
    if (doc.status !== 'ready') {
      toast({
        title: 'Document not ready yet',
        description: 'Wait for processing to finish before chatting with this document.',
        type: 'info',
      });
      return;
    }
    navigate(`/app/chat?doc=${encodeURIComponent(doc.id)}&name=${encodeURIComponent(doc.name)}`);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Documents</h1>
          <p className="text-xs text-secondary mt-1">
            {docs.length} {docs.length === 1 ? 'document' : 'documents'} in your knowledge base
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsUploadOpen(true)}
          leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
        >
          Upload Document
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents…"
          className="w-full h-10 pl-9 pr-9 rounded-xl bg-surface text-primary placeholder:text-muted text-sm border border-border-default hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs"
          aria-label="Search documents"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-secondary hover:text-primary transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <DocumentTableSkeleton rows={4} />
      ) : loadError ? (
        <EmptyState
          illustration="no-search-results"
          title="Could not load documents"
          description={loadError}
          primaryAction={{ label: 'Retry', variant: 'secondary', onClick: load }}
        />
      ) : filtered.length === 0 ? (
        query ? (
          <EmptyState
            illustration="no-search-results"
            title="No matching documents"
            description={`Nothing matches "${query}". Try a different keyword or clear the search.`}
            primaryAction={{ label: 'Clear Search', variant: 'secondary', onClick: () => setQuery('') }}
          />
        ) : (
          <EmptyState
            illustration="no-documents"
            title="No documents yet"
            description="Upload your first PDF or TXT file. Knowva will process it so you can ask AI questions about it."
            primaryAction={{ label: 'Upload Document', variant: 'primary', onClick: () => setIsUploadOpen(true) }}
          />
        )
      ) : (
        <div className="bg-surface border border-border-default rounded-xl overflow-hidden shadow-xs">
          {/* Table head */}
          <div className="hidden sm:grid grid-cols-[2fr_0.7fr_1fr_1fr_64px] gap-3 px-4 py-3 border-b border-border-default bg-surface-hover/40 text-[10px] font-mono font-bold uppercase tracking-wider text-muted select-none">
            <span>Name</span>
            <span>Type</span>
            <span>Uploaded</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-border-subtle">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_0.7fr_1fr_1fr_64px] gap-3 items-center px-4 py-3.5 hover:bg-surface-hover/40 transition-colors"
              >
                {/* Name — clickable to detail */}
                <Link to={`/app/documents/${doc.id}`} className="flex items-center gap-3 min-w-0 group">
                  <div className="p-2 rounded-lg bg-surface-hover text-secondary shrink-0 group-hover:text-brand-400 transition-colors">
                    <DocumentTypeIcon type={doc.file_type} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-primary truncate group-hover:text-brand-400 transition-colors">
                      {doc.name}
                    </p>
                    <p className="text-[10px] text-muted font-mono sm:hidden">
                      {doc.file_type.toUpperCase()} · {formatDate(doc.created_at)}
                    </p>
                  </div>
                </Link>

                <span className="hidden sm:block text-[10px] font-mono text-secondary uppercase">
                  {doc.file_type}
                </span>
                <span className="hidden sm:block text-xs text-secondary">
                  {formatDate(doc.created_at)}
                </span>
                <div className="flex items-center gap-2 justify-end sm:justify-start">
                  <DocumentStatusBadge status={doc.status} />
                  <button
                    type="button"
                    onClick={() => handleAskAi(doc)}
                    disabled={doc.status !== 'ready'}
                    aria-label={`Ask AI about ${doc.name}`}
                    title="Ask AI about this document"
                    className="hidden sm:flex p-1.5 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-end">
                  <RowMenu
                    doc={doc}
                    onRename={(d) => { setRenameDoc(d); setRenameValue(d.name); }}
                    onDelete={setDeleteDoc}
                    onAskAi={handleAskAi}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={load}
      />

      {/* Rename modal */}
      <Modal
        isOpen={renameDoc !== null}
        onClose={() => setRenameDoc(null)}
        title="Rename Document"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Document name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleRenameSave()}
          />
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setRenameDoc(null)}>Cancel</Button>
            <Button size="sm" disabled={!renameValue.trim()} onClick={handleRenameSave}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={deleteDoc !== null}
        onClose={() => setDeleteDoc(null)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`"${deleteDoc?.name}" will be permanently removed from your knowledge base, including its AI index. This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
};
